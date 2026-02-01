// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import AuthLayout from "./AuthLayout";
// import "./Login.css";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   return (
//     <AuthLayout
//       title="Welcome back"
//       subtitle="Continue managing care with confidence"
//     >
//       <input
//         placeholder="Email or phone"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />

//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />

//       <button onClick={() => navigate("/role")}>
//         Continue to CareFlow
//       </button>

//       <div className="links">
//         <span onClick={() => navigate("/forgot-password")}>
//           Forgot password?
//         </span>
//         <span onClick={() => navigate("/signup")}>
//           Create account
//         </span>
//       </div>
//     </AuthLayout>
//   );
// }


import AuthLayout from "./AuthLayout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import authService from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError("");
      const data = await authService.login(email, password);
      // data.user should process from backend response
      // backend returns { token, user: { id, email } }
      login(data.user);
      
      // Fetch and store default care profile
      try {
          const profileRes = await authService.getDefaultCareProfile();
          if (profileRes && profileRes._id) {
              localStorage.setItem('careProfileId', profileRes._id);
          } else {
              // Create one if missing? Or handle in AddMedication
              console.log("No care profile found, using demo/default.");
          }
      } catch (e) {
          console.warn("Failed to fetch default profile:", e);
      }

      navigate("/onboarding/role");
    } catch (err) {
      console.error("Login failed:", err);
      // Log more details if available
      if (err.response) {
          console.error("Error Response Data:", err.response.data);
          console.error("Error Status:", err.response.status);
      }
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Continue managing care with confidence"
    >
      {error && <p className="error-message" style={{color: 'red'}}>{error}</p>}
      <input
        placeholder="Email or phone"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>
        Continue to CareFlow
      </button>

      <div className="links">
        <span onClick={() => navigate("/forgot-password")}>
          Forgot password?
        </span>
        <span onClick={() => navigate("/signup")}>
          Create account
        </span>
      </div>
    </AuthLayout>
  );
}

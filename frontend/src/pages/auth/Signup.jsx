import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import authService from "../../services/authService";
import "./Signup.css";

export default function Signup() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      setError("");
      // NOTE: Original UI had an OTP step. 
      // Backend /signup simply creates the user.
      // Adjusting to direct signup for now based on backend capabilities,
      // or we can simulate the "Send verification code" -> "Verify" flow if backend supported it.
      // Checked backend: /signup takes { name, email, password } usually.
      // Let's assume standard signup for now.
      
      await authService.signup({ name, email, password });
      navigate("/login");
    } catch (err) {
      console.error("Signup failed", err);
      setError("Failed to create account. Please try again.");
    }
  };

  return (
    <AuthLayout
      title="Get started with CareFlow"
      subtitle="Set up care that adapts with you"
    >
      {error && <p className="error-message" style={{color: 'red'}}>{error}</p>}
      
      {step === 1 && (
        <>
          <input 
            placeholder="Full name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input 
            placeholder="Email or phone" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={() => setStep(2)}>
            Continue
          </button>
        </>
      )}

      {step === 2 && (
        <>
          {/* 
            TODO: If backend requires OTP, implement specific logic.
            Currently backend just has /signup. 
            So we'll take the password here and submit everything.
          */}
          <input 
            type="password" 
            placeholder="Set password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleSignup}>
            Create account
          </button>
        </>
      )}

      <p className="switch" onClick={() => navigate("/login")}>
        Already have an account? Sign in
      </p>
    </AuthLayout>
  );
}

import AuthLayout from "./AuthLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  
  // State for form fields
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // State for UI feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSendOTP = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");
      await authService.forgotPassword(email);
      setMessage("OTP sent! Check your email.");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = () => {
      // In this flow, we don't have a separate "Verify OTP" endpoint that just checks validity 
      // without resetting. We can either add one, or just move to step 3 and submit everything there.
      // For now, let's just move to step 3 as the Reset endpoint verifies the OTP anyway.
      if (!otp) {
          setError("Please enter the OTP");
          return;
      }
      setStep(3);
      setError("");
      setMessage("");
  };

  const handleResetPassword = async () => {
      if (newPassword !== confirmPassword) {
          setError("Passwords do not match");
          return;
      }
      try {
          setLoading(true);
          setError("");
          await authService.resetPassword(email, otp, newPassword);
          setMessage("Password reset successful! Redirecting...");
          setTimeout(() => navigate("/login"), 2000);
      } catch (err) {
          setError(err.response?.data?.message || "Failed to reset password");
      } finally {
          setLoading(false);
      }
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="We’ll help you get back safely"
    >
      {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
      {message && <div className="success-message" style={{color: 'green', marginBottom: '10px'}}>{message}</div>}

      {/* STEP 1 – REQUEST OTP */}
      {step === 1 && (
        <>
          <input 
            placeholder="Email or phone" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSendOTP} disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </>
      )}

      {/* STEP 2 – VERIFY OTP */}
      {step === 2 && (
        <>
          <p style={{textAlign: 'center', fontSize: '0.9rem', color: '#666'}}>
             Enter the OTP sent to {email}
          </p>
          <input 
            placeholder="Enter OTP" 
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleVerifyOTP}>
            Verify OTP
          </button>
        </>
      )}

      {/* STEP 3 – RESET PASSWORD */}
      {step === 3 && (
        <>
          <input 
            type="password" 
            placeholder="New password" 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Confirm password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button onClick={handleResetPassword} disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </>
      )}
    </AuthLayout>
  );
}

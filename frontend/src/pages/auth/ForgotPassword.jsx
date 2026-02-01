import AuthLayout from "./AuthLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="We’ll help you get back safely"
    >
      {/* STEP 1 – REQUEST OTP */}
      {step === 1 && (
        <>
          <input placeholder="Email or phone" />
          <button onClick={() => setStep(2)}>
            Send OTP
          </button>
        </>
      )}

      {/* STEP 2 – VERIFY OTP */}
      {step === 2 && (
        <>
          <input placeholder="Enter OTP" />
          <button onClick={() => setStep(3)}>
            Verify OTP
          </button>
        </>
      )}

      {/* STEP 3 – RESET PASSWORD */}
      {step === 3 && (
        <>
          <input type="password" placeholder="New password" />
          <input type="password" placeholder="Confirm password" />
          <button onClick={() => navigate("/login")}>
            Reset Password
          </button>
        </>
      )}
    </AuthLayout>
  );
}

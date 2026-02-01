import "./Signup.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OtpVerify() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <h1>Verify OTP</h1>
        <p className="subtitle">
          Enter the code sent to your phone or email
        </p>

        <input
          placeholder="6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button onClick={() => navigate("/role")}>
          Verify & Continue
        </button>

        <p className="hint">
          Did not receive it? Resend OTP
        </p>
      </div>
    </div>
  );
}

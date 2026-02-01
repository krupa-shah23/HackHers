import { useState } from "react";
import OnboardingLayout from "./OnboardingLayout";
import { useOnboarding } from "../../context/OnboardingContext";
import { useNavigate } from "react-router-dom";

export default function RoleIntro() {
  const { update } = useOnboarding();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const handleContinue = () => {
    if (selected) {
      update({ role: selected });
      navigate("/onboarding/context");
    }
  };

  return (
    <OnboardingLayout
      title="How are you using CareFlow?"
      subtitle="This helps us personalize your experience"
      step={1}
    >
      <div className="options-container">
        <p className="section-label">Select one</p>
        <div
          className={`option-card ${selected === "self" ? "selected" : ""}`}
          onClick={() => setSelected("self")}
        >
          <div className="option-title">Managing my own care</div>
          <div className="option-desc">
            Medications, reminders, appointments
          </div>
        </div>

        <div
          className={`option-card ${selected === "caregiver" ? "selected" : ""}`}
          onClick={() => setSelected("caregiver")}
        >
          <div className="option-title">Managing care for someone else</div>
          <div className="option-desc">
            Parent, partner, or family member
          </div>
        </div>
      </div>

      <button
        className="primary-btn"
        onClick={handleContinue}
        disabled={!selected}
        style={{ marginTop: "2rem" }}
      >
        Continue →
      </button>
    </OnboardingLayout>
  );
}

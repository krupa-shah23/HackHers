import { useState, useEffect } from "react";
import OnboardingLayout from "./OnboardingLayout";
import { useOnboarding } from "../../context/OnboardingContext";
import { useNavigate } from "react-router-dom";

export default function CareContext() {
  const { onboarding, update } = useOnboarding();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (onboarding.role === "self") {
      navigate("/onboarding/comfort");
    }
  }, [onboarding.role, navigate]);

  if (onboarding.role === "self") {
    return null;
  }

  const handleContinue = () => {
    if (selected) {
      update({ careFor: selected });
      navigate("/onboarding/comfort");
    }
  };

  const options = [
    { id: "parent", title: "Parent", desc: "Mom, dad, or in-law" },
    { id: "partner", title: "Partner", desc: "Spouse or significant other" },
    { id: "child", title: "Child", desc: "Son, daughter, or young relative" },
    { id: "other", title: "Other", desc: "Friend, neighbor, or extended family" },
  ];

  return (
    <OnboardingLayout
      title="Who are you helping?"
      subtitle="This helps us adapt the experience"
      step={2}
    >
      <div className="options-container">
        <p className="section-label">Select one</p>
        
        {options.map((opt) => (
          <div
            key={opt.id}
            className={`option-card ${selected === opt.id ? "selected" : ""}`}
            onClick={() => setSelected(opt.id)}
          >
            <div className="option-title">{opt.title}</div>
            <div className="option-desc">{opt.desc}</div>
          </div>
        ))}
      </div>

      <button
        className="primary-btn"
        onClick={handleContinue}
        disabled={!selected}
      >
        Continue →
      </button>
    </OnboardingLayout>
  );
}

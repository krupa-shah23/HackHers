import { useState } from "react";
import OnboardingLayout from "./OnboardingLayout";
import { useOnboarding } from "../../context/OnboardingContext";
import { useNavigate } from "react-router-dom";

export default function ComfortLevel() {
  const { update } = useOnboarding();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const handleContinue = () => {
    if (selected) {
      update({ comfortLevel: selected });
      navigate("/onboarding/priorities");
    }
  };

  const options = [
    { id: "high", title: "Very comfortable", desc: "I use apps and tools regularly" },
    { id: "medium", title: "Somewhat comfortable", desc: "I know the basics" },
    { id: "low", title: "Not comfortable", desc: "I prefer simple, guided experiences" },
  ];

  return (
    <OnboardingLayout
      title="Comfort with technology"
      subtitle="We will keep things as simple as needed"
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

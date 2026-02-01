import OnboardingLayout from "./OnboardingLayout";
import { useOnboarding } from "../../context/OnboardingContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const options = [
  { id: "meds", title: "Remembering medications", desc: "Doses, refills, and timings" },
  { id: "pharmacy", title: "Refills & pharmacy visits", desc: "Tracking supply and pickups" },
  { id: "routines", title: "Keeping routines consistent", desc: "Daily habits and schedules" },
  { id: "instructions", title: "Understanding instructions", desc: "Doctor notes and care plans" },
  { id: "coordination", title: "Coordinating between people", desc: "Sharing info with family/doctors" },
];

export default function CarePriorities() {
  const { update } = useOnboarding();
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const continueNext = () => {
    update({ priorities: selected });
    navigate("/onboarding/done");
  };

  return (
    <OnboardingLayout
      title="What feels hardest right now?"
      subtitle="You can change this anytime"
      step={3}
    >
      <div className="options-container">
        <p className="section-label">Select all that apply</p>

        {options.map((opt) => (
          <div
            key={opt.id}
            className={`option-card ${selected.includes(opt.id) ? "selected" : ""}`}
            onClick={() => toggle(opt.id)}
          >
            <div className="option-title">{opt.title}</div>
            <div className="option-desc">{opt.desc}</div>
          </div>
        ))}
      </div>

      <button className="primary-btn" onClick={continueNext}>
        Continue →
      </button>
    </OnboardingLayout>
  );
}

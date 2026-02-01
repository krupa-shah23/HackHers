import OnboardingLayout from "./OnboardingLayout";
import { useOnboarding } from "../../context/OnboardingContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const options = [
  "Remembering medications",
  "Refills & pharmacy visits",
  "Keeping routines consistent",
  "Understanding instructions",
  "Coordinating between people",
];

export default function CarePriorities() {
  const { update } = useOnboarding();
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  const toggle = (item) => {
    setSelected((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
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
    >
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => toggle(opt)}
          className={selected.includes(opt) ? "active" : ""}
        >
          {opt}
        </button>
      ))}

      <button onClick={continueNext}>Continue</button>
    </OnboardingLayout>
  );
}

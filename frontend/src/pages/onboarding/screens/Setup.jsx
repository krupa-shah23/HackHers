import OnboardingLayout from "../OnboardingLayout";
import OptionCard from "../components/OptionCard";
import Chip from "../components/Chip";
import { useOnboarding } from "../../../context/OnboardingContext";
import { useNavigate } from "react-router-dom";

const priorities = [
  "Remembering medications",
  "Refills & pharmacy visits",
  "Keeping routines consistent",
  "Understanding instructions",
  "Coordinating between people",
];

export default function Setup() {
  const { onboarding, update } = useOnboarding();
  const navigate = useNavigate();

  const togglePriority = (p) => {
    const exists = onboarding.priorities.includes(p);
    update({
      priorities: exists
        ? onboarding.priorities.filter((x) => x !== p)
        : [...onboarding.priorities, p],
    });
  };

  return (
    <OnboardingLayout
      title="How should CareFlow support you?"
      subtitle="We will keep things as simple as needed"
    >
      <OptionCard
        title="Very comfortable with technology"
        selected={onboarding.comfortLevel === "high"}
        onClick={() => update({ comfortLevel: "high" })}
      />
      <OptionCard
        title="Somewhat comfortable"
        selected={onboarding.comfortLevel === "medium"}
        onClick={() => update({ comfortLevel: "medium" })}
      />
      <OptionCard
        title="Not comfortable"
        selected={onboarding.comfortLevel === "low"}
        onClick={() => update({ comfortLevel: "low" })}
      />

      <p style={{ marginTop: "1rem" }}>What feels hardest right now?</p>
      {priorities.map((p) => (
        <Chip
          key={p}
          label={p}
          selected={onboarding.priorities.includes(p)}
          onClick={() => togglePriority(p)}
        />
      ))}

      <button
        className="primary-btn"
        onClick={() => navigate("/onboarding/finish")}
      >
        Continue →
      </button>
    </OnboardingLayout>
  );
}

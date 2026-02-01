import OnboardingLayout from "../OnboardingLayout";
import OptionCard from "../components/OptionCard";
import { useOnboarding } from "../../../context/OnboardingContext";
import { useNavigate } from "react-router-dom";

export default function Start() {
  const { onboarding, update } = useOnboarding();
  const navigate = useNavigate();

  return (
    <OnboardingLayout
      title="How are you using CareFlow?"
      subtitle="This helps us personalize your experience"
      step={1}
    >
      <p style={{ fontWeight: 600 }}>Select one</p>

      <OptionCard
        title="Managing my own care"
        subtitle="Medications, reminders, appointments"
        selected={onboarding.role === "self"}
        onClick={() =>
          update({ role: "self", careFor: "" })
        }
      />

      <OptionCard
        title="Managing care for someone else"
        subtitle="Parent, partner, or family member"
        selected={onboarding.role === "caregiver"}
        onClick={() => update({ role: "caregiver" })}
      />

      {onboarding.role === "caregiver" && (
        <>
          <p
            style={{
              marginTop: "1.5rem",
              fontWeight: 600,
            }}
          >
            Who are you helping?
          </p>

          {["Parent", "Partner", "Child", "Other"].map((p) => (
            <OptionCard
              key={p}
              title={p}
              selected={onboarding.careFor === p}
              onClick={() => update({ careFor: p })}
            />
          ))}
        </>
      )}

      <button
        className="primary-btn"
        disabled={
          !onboarding.role ||
          (onboarding.role === "caregiver" &&
            !onboarding.careFor)
        }
        onClick={() => navigate("/onboarding/setup")}
      >
        Continue →
      </button>
    </OnboardingLayout>
  );
}

import OnboardingLayout from "../OnboardingLayout";
import { useOnboarding } from "../../../context/OnboardingContext";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../../../services/api";

export default function Finish() {
  const { onboarding } = useOnboarding();
  const navigate = useNavigate();

  const handleFinish = async () => {
    try {
      // Filter out empty fields to prevent Mongoose validation errors
      // (e.g. sending role: "" overwrites existing role with invalid value)
      const cleanPayload = Object.fromEntries(
        Object.entries({
            ...onboarding,
            onboardingCompleted: true
        }).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
      );

      await updateUser(cleanPayload);

      if (onboarding.role === "self" || (!onboarding.role && cleanPayload.role !== "caregiver")) {
        navigate("/dashboard/elder");
      } else {
        navigate("/dashboard/caregiver");
      }
    } catch (error) {
        console.error("Error saving onboarding:", error);
        alert("Something went wrong. Please try again.");
    }
  };

  return (
    <OnboardingLayout
      title="CareFlow adapts as life changes"
      subtitle="Nothing here is permanent"
      step={3}
    >
      <p>
        We will keep things <b>{onboarding.comfortLevel}</b>, focus on{" "}
        <b>{onboarding.priorities.join(", ")}</b>, and adapt as your care
        needs evolve.
      </p>

      <button
        className="primary-btn"
        onClick={handleFinish}
      >
        Enter CareFlow →
      </button>
    </OnboardingLayout>
  );
}

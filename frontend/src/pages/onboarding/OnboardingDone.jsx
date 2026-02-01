import OnboardingLayout from "./OnboardingLayout";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../../context/OnboardingContext";
import { updateUser } from "../../services/api";

export default function OnboardingDone() {
  const navigate = useNavigate();
  const { onboarding } = useOnboarding();

  const handleFinish = async () => {
    try {
      await updateUser({
        ...onboarding,
        onboardingCompleted: true,
      });

      if (onboarding.role === "self") {
        navigate("/dashboard/elder");
      } else {
        navigate("/dashboard/caregiver");
      }
    } catch (error) {
      console.error("Error saving onboarding preferences:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <OnboardingLayout
      title="CareFlow adapts as life changes"
      subtitle="You’re not locking anything in"
      step={3}
    >
      <div className="options-container">
        <p style={{ color: "#475569", lineHeight: "1.6", marginBottom: "2rem" }}>
          You can add people, change roles, or simplify things anytime. 
          Your setup is flexible.
        </p>
      </div>

      <button className="primary-btn" onClick={handleFinish}>
        Enter CareFlow
      </button>
    </OnboardingLayout>
  );
}

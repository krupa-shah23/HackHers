import OnboardingLayout from "./OnboardingLayout";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../../context/OnboardingContext";

export default function OnboardingDone() {
  const navigate = useNavigate();
  const { onboarding } = useOnboarding();

  const enterCareFlow = () => {
    if (onboarding.role === "self") {
      navigate("/dashboard/elder");
    } else {
      // caregiver OR both
      navigate("/dashboard/caregiver");
    }
  };

  return (
    <OnboardingLayout
      title="CareFlow adapts as life changes"
      subtitle="You’re not locking anything in"
    >
      <p style={{ marginBottom: "2rem" }}>
        You can add people, change roles, or simplify things anytime.
      </p>

      <button onClick={() => navigate("/dashboard/caregiver")}>
  Enter CareFlow
</button>
    </OnboardingLayout>
  );
}

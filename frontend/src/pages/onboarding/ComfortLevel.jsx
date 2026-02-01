import OnboardingLayout from "./OnboardingLayout";
import { useOnboarding } from "../../context/OnboardingContext";
import { useNavigate } from "react-router-dom";

export default function ComfortLevel() {
  const { update } = useOnboarding();
  const navigate = useNavigate();

  const select = (level) => {
    update({ comfortLevel: level });
    navigate("/onboarding/priorities");
  };

  return (
    <OnboardingLayout
      title="Comfort with technology"
      subtitle="We will keep things as simple as needed"
    >
      <button onClick={() => select("high")}>Very comfortable</button>
      <button onClick={() => select("medium")}>Somewhat comfortable</button>
      <button onClick={() => select("low")}>Not comfortable</button>
    </OnboardingLayout>
  );
}

import { useEffect } from "react";
import OnboardingLayout from "./OnboardingLayout";
import { useOnboarding } from "../../context/OnboardingContext";
import { useNavigate } from "react-router-dom";

export default function CareContext() {
  const { onboarding, update } = useOnboarding();
  const navigate = useNavigate();

  useEffect(() => {
    if (onboarding.role === "self") {
      navigate("/onboarding/comfort");
    }
  }, [onboarding.role, navigate]);

  if (onboarding.role === "self") {
    return null;
  }

  const select = (careFor) => {
    update({ careFor });
    navigate("/onboarding/comfort");
  };

  return (
    <OnboardingLayout
      title="Who are you helping?"
      subtitle="This helps us adapt the experience"
    >
      <button onClick={() => select("parent")}>Parent</button>
      <button onClick={() => select("partner")}>Partner</button>
      <button onClick={() => select("child")}>Child</button>
      <button onClick={() => select("other")}>Other</button>
    </OnboardingLayout>
  );
}

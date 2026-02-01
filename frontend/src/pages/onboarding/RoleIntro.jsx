import OnboardingLayout from "./OnboardingLayout";
import { useOnboarding } from "../../context/OnboardingContext";
import { useNavigate } from "react-router-dom";

export default function RoleIntro() {
  const { update } = useOnboarding();
  const navigate = useNavigate();

  const selectRole = (role) => {
    update({ role });
    navigate("/onboarding/context");
  };

  return (
    <OnboardingLayout
      title="How are you using CareFlow?"
      subtitle="Healthcare looks different for everyone"
    >
      <button onClick={() => selectRole("self")}>
        Managing my own care
      </button>

      <button onClick={() => selectRole("caregiver")}>
        Managing care for someone else
      </button>

      <button onClick={() => selectRole("both")}>
        Both
      </button>
    </OnboardingLayout>
  );
}

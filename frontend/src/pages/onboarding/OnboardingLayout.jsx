import "./Onboarding.css";
import ProgressBar from "./components/ProgressBar";

export default function OnboardingLayout({
  title,
  subtitle,
  step,
  children,
}) {
  return (
    <div className="onboarding-wrapper">
      <div className="onboarding-shell">
        {/* LEFT PANEL */}
        <div className="onboarding-left">
          <h2>CareFlow Questionnaire</h2>
          <p>
            Answer a few quick questions so we can adapt CareFlow to
            your care needs.
          </p>

          <ProgressBar current={step || 1} total={3} />
        </div>

        {/* RIGHT PANEL */}
        <div className="onboarding-right">
          <h1>{title}</h1>
          <p className="subtitle">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

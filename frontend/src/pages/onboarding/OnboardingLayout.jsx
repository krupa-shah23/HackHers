import "./OnboardingLayout.css";

export default function OnboardingLayout({ title, subtitle, children }) {
  return (
    <div className="onboarding-layout">
      <div className="onboarding-card">
        <h1>{title}</h1>
        <p className="subtitle">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}

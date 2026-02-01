import "./AuthLayout.css";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth-layout">
      {/* LEFT SIDE */}
      <div className="auth-visual">
        <div className="auth-story">
          <h1 className="auth-logo">CareFlow</h1>
          <p>
            Healthcare isn&apos;t just personal.  
            It&apos;s shared, ongoing, and human.
          </p>
        </div>

        <div className="auth-divider" />
      </div>

      {/* RIGHT SIDE */}
      <div className="auth-form">
        <div className="auth-card-modern">
          <h2>{title}</h2>
          <p className="auth-subtitle">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

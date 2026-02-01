export default function OptionCard({
  title,
  subtitle,
  selected,
  onClick,
}) {
  return (
    <div
      className={`option-card ${selected ? "selected" : ""}`}
      onClick={onClick}
    >
      <strong>{title}</strong>
      {subtitle && <p style={{ color: "#64748b" }}>{subtitle}</p>}
    </div>
  );
}

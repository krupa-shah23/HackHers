// src/onboarding/components/Chip.jsx
export default function Chip({ label, selected, onClick }) {
  return (
    <span
      className={`chip ${selected ? "selected" : ""}`}
      onClick={onClick}
    >
      {label}
    </span>
  );
}

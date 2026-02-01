export default function ProgressBar({ current, total }) {
  const progress = Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <div className="progress-container">
      <div className="progress-info">
        <span>Step {current} of {total}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="progress-track">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

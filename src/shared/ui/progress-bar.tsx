type ProgressBarProps = {
  value: number;
  tone?: 'accent' | 'success';
  label?: string;
};

export function ProgressBar({ value, tone = 'accent', label }: ProgressBarProps) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div aria-label={label} className="progress-track" role="progressbar" aria-valuemax={100} aria-valuemin={0} aria-valuenow={safeValue}>
      <div className={`progress-value progress-value-${tone}`} style={{ width: `${safeValue}%` }} />
    </div>
  );
}

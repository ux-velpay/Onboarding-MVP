interface StepBarProps {
  current: number; // 1-based
  total: number;
}

/** Purple progress bar for the wizard header (replaces the dot stepper). */
export function StepBar({ current, total }: StepBarProps) {
  const pct = Math.max(0, Math.min(100, Math.round((current / total) * 100)));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-purple-100">
      <div
        className="h-full rounded-full bg-primary-dark transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

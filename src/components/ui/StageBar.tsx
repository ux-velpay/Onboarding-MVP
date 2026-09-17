import { cn } from "@/lib/cn";

const STAGE_LABELS = ["Cuenta", "Negocio", "Documentación", "Activación"] as const;

/**
 * Same visual as the old StepBar but driven by 4 named stages.
 * `active` is 0-indexed: 0=Cuenta, 1=Negocio, 2=Documentación, 3=Activación.
 * Fill: 25% per completed/active stage so the bar never sits at 0%.
 */
export function StageBar({ active }: { active: number }) {
  const pct = Math.round(((active + 1) / STAGE_LABELS.length) * 100);
  const label = STAGE_LABELS[active] ?? STAGE_LABELS[0];

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className={cn("text-[14px] font-medium text-primary")}>{label}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-purple-100">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

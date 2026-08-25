import type { ComponentType, ReactNode, SVGProps } from "react";
import { cn } from "@/lib/cn";

interface RadioCardProps {
  selected: boolean;
  onSelect: () => void;
  title: ReactNode;
  description?: ReactNode;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
}

export function RadioCard({
  selected,
  onSelect,
  title,
  description,
  icon: Icon,
}: RadioCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "focus-ring flex w-full items-center gap-4 rounded-[14px] border px-4 py-4 text-left transition-colors",
        selected
          ? "border-primary bg-purple-50"
          : "border-line bg-white hover:border-line-strong"
      )}
    >
      {Icon && (
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors",
            selected ? "bg-primary-dark text-white" : "bg-page text-ink-2"
          )}
        >
          <Icon width={20} height={20} />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block text-[15px] font-medium",
            selected ? "text-primary-dark" : "text-ink"
          )}
        >
          {title}
        </span>
        {description && (
          <span className="mt-0.5 block text-[13px] leading-snug text-ink-3">
            {description}
          </span>
        )}
      </span>
      <span
        className={cn(
          "relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          selected ? "border-primary" : "border-line-strong"
        )}
      >
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
      </span>
    </button>
  );
}

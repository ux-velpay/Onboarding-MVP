import { cn } from "@/lib/cn";

interface Option<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  value: T | null;
  onChange: (value: T) => void;
  options: Option<T>[];
}

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
}: SegmentedControlProps<T>) {
  return (
    <div className="flex gap-3">
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={selected}
            className={cn(
              "focus-ring flex flex-1 items-center gap-2.5 rounded-[10px] border px-4 py-3 text-[14px] transition-colors",
              selected
                ? "border-primary bg-purple-50 font-medium text-primary-dark"
                : "border-line bg-white text-ink-3 hover:border-line-strong"
            )}
          >
            <span
              className={cn(
                "relative flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2",
                selected ? "border-primary" : "border-line-strong"
              )}
            >
              {selected && <span className="h-2 w-2 rounded-full bg-primary" />}
            </span>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

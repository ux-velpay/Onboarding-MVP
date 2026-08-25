import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ChevronDown } from "./icons";
import { FieldShell } from "./TextField";

interface SelectFieldProps extends ComponentPropsWithoutRef<"select"> {
  label?: ReactNode;
  hint?: ReactNode;
  placeholder?: string;
  options: string[];
}

export function SelectField({
  label,
  hint,
  placeholder,
  options,
  className,
  value,
  ...props
}: SelectFieldProps) {
  return (
    <FieldShell label={label} hint={hint}>
      <div className="relative">
        <select
          className={cn(
            "focus-ring h-[52px] w-full appearance-none rounded-[10px] border border-line bg-white px-4 pr-11 text-[15px] text-ink transition-colors",
            !value && "text-placeholder",
            className
          )}
          value={value}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt} value={opt} className="text-ink">
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-3" />
      </div>
    </FieldShell>
  );
}

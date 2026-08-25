import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface StepTitleProps {
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
}

export function StepTitle({ title, subtitle, className }: StepTitleProps) {
  return (
    <div className={cn("mb-6", className)}>
      <h2 className="text-[28px] font-medium leading-tight tracking-tight text-primary-dark">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-[15px] leading-relaxed text-ink-3">{subtitle}</p>
      )}
    </div>
  );
}

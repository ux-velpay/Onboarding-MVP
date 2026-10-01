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
      <h2 className="text-[18px] font-medium text-[#292828]" style={{ lineHeight: "116%" }}>
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-[15px] leading-relaxed text-ink-3">{subtitle}</p>
      )}
    </div>
  );
}

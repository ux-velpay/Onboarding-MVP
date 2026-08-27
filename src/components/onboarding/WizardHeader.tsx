"use client";

import { cn } from "@/lib/cn";
import { stepNumber, totalSteps } from "@/lib/flow";
import { ArrowLeft } from "@/components/ui/icons";
import { StepBar } from "@/components/ui/StepBar";
import { useOnboarding } from "./provider";

interface WizardHeaderProps {
  /** Override the computed step (1-based). Pass null to hide the dots. */
  step?: number | null;
  /** Override the right-side "Paso X de Y" text. */
  rightLabel?: string;
}

export function WizardHeader({ step, rightLabel }: WizardHeaderProps) {
  const { back, canGoBack, screen, data } = useOnboarding();
  const total = totalSteps(data);
  const current = step === undefined ? stepNumber(screen, data) : step;

  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={back}
          disabled={!canGoBack}
          className={cn(
            "focus-ring flex items-center gap-2.5 rounded-full text-[15px] font-medium text-primary-dark transition-opacity",
            !canGoBack && "cursor-default opacity-40"
          )}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-dark text-white">
            <ArrowLeft width={16} height={16} />
          </span>
          Atrás
        </button>
        <span className="text-[14px] text-ink-3">
          {rightLabel ?? (current ? `Paso ${current} de ${total}` : null)}
        </span>
      </div>
      {current && (
        <div className="mt-4">
          <StepBar current={current} total={total} />
        </div>
      )}
    </div>
  );
}

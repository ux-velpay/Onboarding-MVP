"use client";

import type { ReactNode } from "react";
import { StepBar } from "@/components/ui/StepBar";
import { VelpayLogo } from "@/components/ui/VelpayLogo";
import { totalSteps } from "@/lib/flow";
import { SplitLayout } from "../SplitLayout";
import { useOnboarding } from "../provider";

/** Shared layout for the account-creation screens: logo + progress bar + content,
 *  grouped and centered (matches the auth mockups). */
export function AuthScreen({ step, children }: { step: number; children: ReactNode }) {
  const { data } = useOnboarding();
  return (
    <SplitLayout align="center">
      <div className="w-full">
        <VelpayLogo />
        <div className="mt-6">
          <StepBar current={step} total={totalSteps(data)} />
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </SplitLayout>
  );
}

export function AuthTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-[26px] font-semibold leading-tight tracking-tight text-primary-dark">
      {children}
    </h2>
  );
}

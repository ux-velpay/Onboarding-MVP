"use client";

import type { ReactNode } from "react";
import { StageBar } from "@/components/ui/StageBar";
import { VelpayLogo } from "@/components/ui/VelpayLogo";
import { ArrowLeft } from "@/components/ui/icons";
import { SplitLayout } from "../SplitLayout";

/**
 * Shared layout for all onboarding steps.
 * `stage` is 0-indexed: 0=Cuenta, 1=Negocio, 2=Documentación, 3=Activación.
 */
export function AuthScreen({
  stage,
  footer,
  onBack,
  children,
}: {
  stage: number;
  footer?: ReactNode;
  onBack?: () => void;
  children: ReactNode;
}) {
  return (
    <SplitLayout align="start" footer={footer}>
      <div className="w-full">
        <div><VelpayLogo /></div>

        {onBack && (
          <div className="mt-5">
            <button
              type="button"
              onClick={onBack}
              aria-label="Atrás"
              className="focus-ring inline-flex text-primary-dark"
            >
              <ArrowLeft width={22} height={22} />
            </button>
          </div>
        )}

        <div className={onBack ? "mt-5" : "mt-6"}>
          <StageBar active={stage} />
        </div>

        <div className="mt-8">{children}</div>
      </div>
    </SplitLayout>
  );
}

export function AuthTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-[18px] font-medium text-[#292828]" style={{ lineHeight: "116%" }}>
      {children}
    </h2>
  );
}

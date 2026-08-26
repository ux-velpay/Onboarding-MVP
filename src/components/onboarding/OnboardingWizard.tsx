"use client";

import type { Screen } from "@/lib/flow";
import { useOnboarding } from "./provider";
import { DemoNav } from "./DemoNav";
import { AuthEmail } from "./steps/AuthEmail";
import { AuthOtp } from "./steps/AuthOtp";
import { AuthPassword } from "./steps/AuthPassword";
import { Activated } from "./steps/Activated";
import { PersonType } from "./steps/PersonType";
import { Documents } from "./steps/Documents";
import { ConfirmData } from "./steps/ConfirmData";
import { Business } from "./steps/Business";
import { BlockedState } from "./steps/BlockedState";
import { HighVolumeRedirect } from "./steps/HighVolumeRedirect";
import {
  StatusAprobado,
  StatusEnviado,
  StatusInfoAdicional,
  StatusRechazado,
} from "./steps/StatusScreens";

const SCREENS: Record<Screen, () => React.JSX.Element> = {
  "auth-email": AuthEmail,
  "auth-otp": AuthOtp,
  "auth-password": AuthPassword,
  "person-type": PersonType,
  documents: Documents,
  confirm: ConfirmData,
  business: Business,
  blocked: BlockedState,
  "high-volume-redirect": HighVolumeRedirect,
  activated: Activated,
  "status-enviado": StatusEnviado,
  "status-info-adicional": StatusInfoAdicional,
  "status-aprobado": StatusAprobado,
  "status-rechazado": StatusRechazado,
};

export function OnboardingWizard() {
  const { screen, hydrated } = useOnboarding();

  if (!hydrated) {
    return <div className="min-h-screen bg-white" />;
  }

  const Step = SCREENS[screen];
  return (
    <>
      <div key={screen}>
        <Step />
      </div>
      <DemoNav />
    </>
  );
}

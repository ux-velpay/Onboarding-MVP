"use client";

import type { Screen } from "@/lib/flow";
import { useOnboarding } from "./provider";
import { DemoNav } from "./DemoNav";
import { AuthEmail } from "./steps/AuthEmail";
import { AuthOtp } from "./steps/AuthOtp";
import { AuthPassword } from "./steps/AuthPassword";
import { BusinessData } from "./steps/BusinessData";
import { SyncTerminal } from "./steps/SyncTerminal";
import { Activated } from "./steps/Activated";
import { PersonType } from "./steps/PersonType";
import { Documents } from "./steps/Documents";
import { CrossCheck } from "./steps/CrossCheck";
import { ConfirmData } from "./steps/ConfirmData";
import { Business } from "./steps/Business";
import { Contact } from "./steps/Contact";
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
  "business-data": BusinessData,
  "sync-terminal": SyncTerminal,
  "person-type": PersonType,
  documents: Documents,
  "cross-check": CrossCheck,
  confirm: ConfirmData,
  business: Business,
  contact: Contact,
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

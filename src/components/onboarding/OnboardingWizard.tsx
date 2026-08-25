"use client";

import type { Screen } from "@/lib/flow";
import { useOnboarding } from "./provider";
import { DemoNav } from "./DemoNav";
import { Welcome } from "./steps/Welcome";
import { PersonType } from "./steps/PersonType";
import { TaxData } from "./steps/TaxData";
import { RfcError } from "./steps/RfcError";
import { SinRfcRoute } from "./steps/SinRfcRoute";
import { BusinessInfo } from "./steps/BusinessInfo";
import { BankData } from "./steps/BankData";
import { BusinessActivity } from "./steps/BusinessActivity";
import { BlockedState } from "./steps/BlockedState";
import { ExpectedVolume } from "./steps/ExpectedVolume";
import { HighVolumeRedirect } from "./steps/HighVolumeRedirect";
import { PaymentChannel } from "./steps/PaymentChannel";
import { TnpExtraInfo } from "./steps/TnpExtraInfo";
import { DocumentChecklist } from "./steps/DocumentChecklist";
import { DocumentUpload } from "./steps/DocumentUpload";
import { Complete } from "./steps/Complete";
import {
  StatusAprobado,
  StatusEnviado,
  StatusInfoAdicional,
  StatusRechazado,
} from "./steps/StatusScreens";

const SCREENS: Record<Screen, () => React.JSX.Element> = {
  welcome: Welcome,
  "person-type": PersonType,
  "tax-data": TaxData,
  "rfc-error": RfcError,
  "sin-rfc-route": SinRfcRoute,
  "business-info": BusinessInfo,
  "bank-data": BankData,
  activity: BusinessActivity,
  blocked: BlockedState,
  volume: ExpectedVolume,
  "high-volume-redirect": HighVolumeRedirect,
  channel: PaymentChannel,
  "tnp-extra-info": TnpExtraInfo,
  checklist: DocumentChecklist,
  upload: DocumentUpload,
  complete: Complete,
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

"use client";

import { Button } from "@/components/ui/Button";
import { IconBadge } from "@/components/ui/IconBadge";
import { AlertTriangle } from "@/components/ui/icons";
import { SplitLayout } from "../SplitLayout";
import { WizardHeader } from "../WizardHeader";
import { useOnboarding } from "../provider";

export function RfcError() {
  const { go } = useOnboarding();
  return (
    <SplitLayout
      header={<WizardHeader />}
      footer={
        <div className="space-y-3">
          <Button fullWidth onClick={() => go("tax-data")}>
            Corregir datos
          </Button>
          <Button variant="secondary" fullWidth>
            Necesito ayuda
          </Button>
        </div>
      }
    >
      <IconBadge icon={AlertTriangle} tone="danger" className="mb-6" />
      <h2 className="text-[28px] font-medium leading-tight tracking-tight text-primary-dark">
        La información fiscal no coincide
      </h2>
      <p className="mt-3 max-w-[440px] text-[15px] leading-relaxed text-ink-3">
        Favor de verificar los datos. El RFC ingresado no corresponde con la
        información fiscal proporcionada.
      </p>
    </SplitLayout>
  );
}

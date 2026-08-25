"use client";

import { Button } from "@/components/ui/Button";
import { Star } from "@/components/ui/icons";
import { SplitLayout } from "../SplitLayout";
import { WizardHeader } from "../WizardHeader";
import { useOnboarding } from "../provider";
import { StepTitle } from "./StepTitle";

export function HighVolumeRedirect() {
  const { back, reset } = useOnboarding();
  return (
    <SplitLayout
      header={<WizardHeader />}
      footer={
        <div className="space-y-4 text-center">
          <Button fullWidth onClick={reset}>
            Crear cuenta y continuar
          </Button>
          <button
            type="button"
            onClick={back}
            className="focus-ring text-[15px] font-semibold text-primary"
          >
            ← Volver
          </button>
        </div>
      }
    >
      <div className="mb-8 flex h-[200px] items-center justify-center rounded-[16px] bg-purple-50">
        <span className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-white shadow-sm">
          <Star className="text-primary" width={28} height={28} />
        </span>
      </div>
      <StepTitle
        title="Tu negocio puede acceder a una solución más completa"
        subtitle="Para continuar con tu registro, crearemos tu cuenta en Velpay Assistant. Disfrutarás de comisiones preferenciales y soporte dedicado."
      />
    </SplitLayout>
  );
}

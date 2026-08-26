"use client";

import { Button } from "@/components/ui/Button";
import { StepBar } from "@/components/ui/StepBar";
import { VelpayLogo } from "@/components/ui/VelpayLogo";
import { TOTAL_STEPS } from "@/lib/flow";
import { SplitLayout } from "../SplitLayout";
import { useOnboarding } from "../provider";
import { StepTitle } from "./StepTitle";

export function Welcome() {
  const { next } = useOnboarding();
  return (
    <SplitLayout
      header={<VelpayLogo />}
      footer={
        <div className="space-y-4 text-center">
          <Button fullWidth onClick={next}>
            Comenzar
          </Button>
          <p className="text-[14px] text-ink-3">
            ¿Ya tienes una cuenta?{" "}
            <span className="font-semibold text-primary">Inicia sesión aquí</span>
          </p>
        </div>
      }
    >
      <StepTitle
        title="Vamos a registrar tu negocio"
        subtitle="Necesitaremos algunos datos y documentos para completar tu solicitud. El proceso tomará menos de 10 minutos."
      />
      <StepBar current={3} total={TOTAL_STEPS} />
    </SplitLayout>
  );
}

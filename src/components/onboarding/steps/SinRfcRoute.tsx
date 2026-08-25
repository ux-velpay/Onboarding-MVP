"use client";

import { Button } from "@/components/ui/Button";
import { Shield } from "@/components/ui/icons";
import { SplitLayout } from "../SplitLayout";
import { WizardHeader } from "../WizardHeader";
import { useOnboarding } from "../provider";
import { StepTitle } from "./StepTitle";

export function SinRfcRoute() {
  const { next } = useOnboarding();
  return (
    <SplitLayout
      header={<WizardHeader />}
      footer={
        <Button fullWidth onClick={next}>
          Continuar con mi registro
        </Button>
      }
    >
      <StepTitle title="Registro sin RFC" />
      <div className="rounded-[12px] bg-surface p-5">
        <p className="mb-4 text-[15px] font-medium text-ink">
          Tu negocio se registrará bajo el giro 5399 (Anexo B) y se usará el RFC de
          Velpay como Agregador. Solo necesitas:
        </p>
        <ul className="space-y-3">
          {[
            "Identificación oficial tipo pasaporte",
            "La operación se restringe a tarjetas nacionales",
          ].map((t) => (
            <li key={t} className="flex items-center gap-3 text-[14px] text-ink-2">
              <Shield className="shrink-0 text-primary" width={18} height={18} />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </SplitLayout>
  );
}

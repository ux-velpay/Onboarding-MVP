"use client";

import { Button } from "@/components/ui/Button";
import { RadioCard } from "@/components/ui/RadioCard";
import { CreditCard, Globe } from "@/components/ui/icons";
import { SplitLayout } from "../SplitLayout";
import { WizardHeader } from "../WizardHeader";
import { useOnboarding } from "../provider";
import { StepTitle } from "./StepTitle";

export function PaymentChannel() {
  const { data, update, next } = useOnboarding();
  return (
    <SplitLayout
      header={<WizardHeader />}
      footer={
        <Button fullWidth disabled={!data.channel} onClick={next}>
          Continuar
        </Button>
      }
    >
      <StepTitle
        title="¿Cómo recibirás pagos?"
        subtitle="Selecciona el canal principal para realizar los cobros en tu negocio."
      />
      <div className="space-y-3">
        <RadioCard
          selected={data.channel === "TP"}
          onSelect={() => update({ channel: "TP" })}
          icon={CreditCard}
          title="Terminal física / mPOS"
          description="Recibe pagos con tarjeta de manera física en tu negocio o punto de venta"
        />
        <RadioCard
          selected={data.channel === "TNP"}
          onSelect={() => update({ channel: "TNP" })}
          icon={Globe}
          title="Pagos en línea"
          description="Vende tus productos a través de internet con pasarelas de pago y links de cobro"
        />
      </div>
    </SplitLayout>
  );
}

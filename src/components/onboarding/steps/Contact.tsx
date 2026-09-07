"use client";

import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { InfoBox } from "@/components/ui/InfoBox";
import { SplitLayout } from "../SplitLayout";
import { WizardHeader } from "../WizardHeader";
import { useOnboarding } from "../provider";
import { StepTitle } from "./StepTitle";

export function Contact() {
  const { data, update, next } = useOnboarding();

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
  const phoneOk = /^\d{10}$/.test(data.phone.replace(/\D/g, ""));
  const complete = emailOk && phoneOk;

  return (
    <SplitLayout
      header={<WizardHeader />}
      footer={
        <Button fullWidth disabled={!complete} onClick={next}>
          Continuar
        </Button>
      }
    >
      <StepTitle
        title="Datos de contacto comercial"
        subtitle="Usaremos esta información para notificarte sobre el estado de tu solicitud."
      />

      <div className="space-y-5">
        <TextField
          label="Correo electrónico"
          type="email"
          inputMode="email"
          placeholder="correo@ejemplo.com"
          value={data.email}
          onChange={(e) => update({ email: e.target.value })}
          error={data.email && !emailOk ? "Ingresa un correo válido" : undefined}
        />
        <TextField
          label="Teléfono de contacto"
          type="tel"
          inputMode="tel"
          placeholder="55 1234 5678"
          value={data.phone}
          onChange={(e) => update({ phone: e.target.value })}
          error={data.phone && !phoneOk ? "Ingresa 10 dígitos" : undefined}
        />
      </div>

      <InfoBox className="mt-6">
        Si tu solicitud requiere información adicional o no es aprobada, te
        contactaremos a este correo y teléfono.
      </InfoBox>
    </SplitLayout>
  );
}

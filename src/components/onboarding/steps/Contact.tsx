"use client";

import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { InfoBox } from "@/components/ui/InfoBox";
import { useOnboarding } from "../provider";
import { AuthScreen, AuthTitle } from "./AuthScreen";

export function Contact() {
  const { data, update, next, back } = useOnboarding();

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
  const phoneOk = /^\d{10}$/.test(data.phone.replace(/\D/g, ""));
  const complete = emailOk && phoneOk;

  return (
    <AuthScreen
      stage={3}
      onBack={back}
      footer={
        <Button variant="secondary" fullWidth disabled={!complete} onClick={next}>
          Continuar
        </Button>
      }
    >
      <AuthTitle>Datos de contacto comercial</AuthTitle>
      <p className="mt-2 mb-6 text-[15px] leading-relaxed text-ink-3">
        Usaremos esta información para notificarte sobre el estado de tu solicitud.
      </p>

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
    </AuthScreen>
  );
}

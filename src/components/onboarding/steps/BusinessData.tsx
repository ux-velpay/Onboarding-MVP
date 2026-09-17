"use client";

import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

import { useOnboarding } from "../provider";
import { AuthScreen, AuthTitle } from "./AuthScreen";

export function BusinessData() {
  const { data, update, next, back, canGoBack } = useOnboarding();
  const phoneOk = /^\d{10}$/.test(data.businessPhone.replace(/\D/g, ""));
  const complete = data.businessName.trim() !== "" && phoneOk;

  return (
    <AuthScreen
      stage={0}
      onBack={canGoBack ? back : undefined}
      footer={
        <Button variant="secondary" fullWidth disabled={!complete} onClick={next}>
          Continuar
        </Button>
      }
    >
      <AuthTitle>Pláticanos de tu negocio</AuthTitle>

      <div className="mt-8 space-y-5">
        <TextField
          label="Nombre del negocio"
          placeholder="Nombre del negocio"
          value={data.businessName}
          onChange={(e) => update({ businessName: e.target.value })}
        />
        <TextField
          label="Teléfono del negocio"
          type="tel"
          inputMode="tel"
          placeholder="Teléfono"
          value={data.businessPhone}
          onChange={(e) => update({ businessPhone: e.target.value })}
          error={data.businessPhone && !phoneOk ? "Ingresa 10 dígitos" : undefined}
        />
      </div>
    </AuthScreen>
  );
}

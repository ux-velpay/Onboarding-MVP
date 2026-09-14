"use client";

import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { StepBar } from "@/components/ui/StepBar";
import { VelpayLogo } from "@/components/ui/VelpayLogo";
import { ArrowLeft } from "@/components/ui/icons";
import { stepNumber, totalSteps } from "@/lib/flow";
import { SplitLayout } from "../SplitLayout";
import { useOnboarding } from "../provider";
import { StepTitle } from "./StepTitle";

/**
 * Alta exprés — datos mínimos del negocio (BR-033).
 * Se pide justo después de crear las credenciales; con estos datos el sistema
 * ya puede crear el comercio y su sucursal.
 */
export function BusinessData() {
  const { data, update, next, back, canGoBack } = useOnboarding();
  const step = stepNumber("business-data", data);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.businessEmail);
  const phoneOk = /^\d{10}$/.test(data.businessPhone.replace(/\D/g, ""));
  const complete = emailOk && phoneOk;

  return (
    <SplitLayout
      align="start"
      header={
        <div>
          <VelpayLogo />
          {step && (
            <div className="mt-6">
              <StepBar current={step} total={totalSteps(data)} />
            </div>
          )}
          <button
            type="button"
            onClick={back}
            disabled={!canGoBack}
            aria-label="Atrás"
            className="focus-ring mt-6 inline-flex text-primary-dark disabled:opacity-40"
          >
            <ArrowLeft width={22} height={22} />
          </button>
        </div>
      }
      footer={
        <Button fullWidth disabled={!complete} onClick={next}>
          Continuar
        </Button>
      }
    >
      <StepTitle
        title="Platícanos de tu negocio"
        subtitle="Con estos datos creamos tu comercio. Aquí te avisaremos sobre el estado de tu registro."
      />

      <div className="space-y-5">
        <TextField
          label="Correo del negocio"
          type="email"
          inputMode="email"
          placeholder="correo@negocio.com"
          value={data.businessEmail}
          onChange={(e) => update({ businessEmail: e.target.value })}
          error={data.businessEmail && !emailOk ? "Ingresa un correo válido" : undefined}
        />
        <TextField
          label="Teléfono del negocio"
          type="tel"
          inputMode="tel"
          placeholder="55 1234 5678"
          value={data.businessPhone}
          onChange={(e) => update({ businessPhone: e.target.value })}
          error={data.businessPhone && !phoneOk ? "Ingresa 10 dígitos" : undefined}
        />
      </div>
    </SplitLayout>
  );
}

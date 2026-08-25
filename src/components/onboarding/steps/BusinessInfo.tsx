"use client";

import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { SplitLayout } from "../SplitLayout";
import { WizardHeader } from "../WizardHeader";
import { useOnboarding } from "../provider";
import { StepTitle } from "./StepTitle";

export function BusinessInfo() {
  const { data, update, next } = useOnboarding();
  const complete = data.businessName.trim() !== "" && data.email.trim() !== "";

  return (
    <SplitLayout
      header={<WizardHeader />}
      footer={
        <Button fullWidth disabled={!complete} onClick={next}>
          Continuar
        </Button>
      }
    >
      <StepTitle title="Datos de tu negocio" />
      <div className="space-y-5">
        <TextField
          label="Nombre comercial"
          placeholder="Ej. Mi Tienda de Ropa"
          hint="Este nombre aparecerá en tus comprobantes."
          value={data.businessName}
          onChange={(e) => update({ businessName: e.target.value })}
        />
        <TextField
          label="Correo electrónico del negocio"
          type="email"
          placeholder="contacto@mitienda.com"
          hint="Usaremos este correo para notificaciones importantes."
          value={data.email}
          onChange={(e) => update({ email: e.target.value })}
        />
        <TextField
          label="Teléfono del negocio"
          placeholder="55 1234 5678"
          hint="Para confirmaciones y soporte."
          value={data.phone}
          onChange={(e) => update({ phone: e.target.value })}
        />
        <TextField
          label="Dirección del negocio"
          placeholder="Av. Principal 123, Ciudad de México"
          hint="Dirección fiscal de tu empresa."
          value={data.address}
          onChange={(e) => update({ address: e.target.value })}
        />
      </div>
    </SplitLayout>
  );
}

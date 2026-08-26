"use client";

import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { SplitLayout } from "../SplitLayout";
import { WizardHeader } from "../WizardHeader";
import { useOnboarding } from "../provider";
import { StepTitle } from "./StepTitle";

export function PersonalData() {
  const { data, update, next } = useOnboarding();
  const isPM = data.personType === "PM";

  const complete =
    data.nombres.trim() !== "" && data.apellidoPaterno.trim() !== "";

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
        title={isPM ? "Datos del representante legal" : "Tus datos personales"}
        subtitle={
          isPM
            ? "Persona que representa legalmente a la empresa."
            : "Como aparecen en tu identificación oficial."
        }
      />
      <div className="space-y-5">
        <TextField
          label="Nombre(s)"
          placeholder="Ej. Ana María"
          value={data.nombres}
          onChange={(e) => update({ nombres: e.target.value })}
        />
        <TextField
          label="Apellido paterno"
          placeholder="Ej. Rodríguez"
          value={data.apellidoPaterno}
          onChange={(e) => update({ apellidoPaterno: e.target.value })}
        />
        <TextField
          label="Apellido materno"
          placeholder="Ej. López"
          value={data.apellidoMaterno}
          onChange={(e) => update({ apellidoMaterno: e.target.value })}
        />
      </div>
    </SplitLayout>
  );
}

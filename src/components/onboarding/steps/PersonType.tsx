"use client";

import { Button } from "@/components/ui/Button";
import { RadioCard } from "@/components/ui/RadioCard";
import { Building, UserIcon } from "@/components/ui/icons";
import { SplitLayout } from "../SplitLayout";
import { WizardHeader } from "../WizardHeader";
import { useOnboarding } from "../provider";
import { StepTitle } from "./StepTitle";

export function PersonType() {
  const { data, update, next } = useOnboarding();

  return (
    <SplitLayout
      header={<WizardHeader />}
      footer={
        <Button fullWidth disabled={!data.personType} onClick={next}>
          Continuar
        </Button>
      }
    >
      <StepTitle
        title="¿Cómo está registrado tu negocio?"
        subtitle="Con esto sabremos qué documentos pedirte."
      />
      <div className="space-y-3">
        <RadioCard
          selected={data.personType === "PF"}
          onSelect={() => update({ personType: "PF" })}
          icon={UserIcon}
          title="Persona física / emprendedor"
          description="Realizo actividades comerciales de manera individual o independiente"
        />
        <RadioCard
          selected={data.personType === "PM"}
          onSelect={() => update({ personType: "PM" })}
          icon={Building}
          title="Persona moral / empresa"
          description="Empresa constituida como sociedad mercantil o asociación civil"
        />
      </div>
    </SplitLayout>
  );
}

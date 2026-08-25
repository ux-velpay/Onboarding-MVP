"use client";

import { Button } from "@/components/ui/Button";
import { RadioCard } from "@/components/ui/RadioCard";
import { VOLUME_RANGES } from "@/lib/catalogs";
import { SplitLayout } from "../SplitLayout";
import { WizardHeader } from "../WizardHeader";
import { useOnboarding } from "../provider";
import { StepTitle } from "./StepTitle";

export function ExpectedVolume() {
  const { data, update, next } = useOnboarding();

  return (
    <SplitLayout
      header={<WizardHeader />}
      footer={
        <Button fullWidth disabled={!data.volumeRangeId} onClick={next}>
          Continuar
        </Button>
      }
    >
      <StepTitle
        title="¿Cuánto esperas vender al mes?"
        subtitle="Selecciona el volumen aproximado de ventas de tu negocio."
      />
      <div className="space-y-3">
        {VOLUME_RANGES.map((r) => (
          <RadioCard
            key={r.id}
            selected={data.volumeRangeId === r.id}
            onSelect={() => update({ volumeRangeId: r.id })}
            title={r.label}
          />
        ))}
      </div>
    </SplitLayout>
  );
}

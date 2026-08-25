"use client";

import { Button } from "@/components/ui/Button";
import { RadioCard } from "@/components/ui/RadioCard";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Building, UserIcon } from "@/components/ui/icons";
import { SplitLayout } from "../SplitLayout";
import { WizardHeader } from "../WizardHeader";
import { useOnboarding } from "../provider";
import { StepTitle } from "./StepTitle";

export function PersonType() {
  const { data, update, next } = useOnboarding();
  const isPF = data.personType === "PF";

  const complete =
    data.personType !== null &&
    data.hasRfc !== null &&
    (!isPF || data.doesBusinessActivity !== null);

  return (
    <SplitLayout
      header={<WizardHeader />}
      footer={
        <Button fullWidth disabled={!complete} onClick={next}>
          Continuar
        </Button>
      }
    >
      <StepTitle title="¿Cómo está registrado tu negocio?" />

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
          onSelect={() => update({ personType: "PM", doesBusinessActivity: null })}
          icon={Building}
          title="Persona moral / empresa"
          description="Empresa constituida como sociedad mercantil o asociación civil"
        />
      </div>

      {data.personType && (
        <div className="mt-6 space-y-5 animate-step">
          <div>
            <p className="mb-2 text-[14px] font-medium text-ink">
              ¿Cuentas con Registro Federal de Contribuyentes (RFC)?
            </p>
            <SegmentedControl
              value={data.hasRfc === null ? null : data.hasRfc ? "yes" : "no"}
              onChange={(v) => update({ hasRfc: v === "yes" })}
              options={[
                { value: "yes", label: "Sí, cuento con RFC" },
                { value: "no", label: "No, aún no lo tengo" },
              ]}
            />
          </div>

          {isPF && (
            <div>
              <p className="mb-2 text-[14px] font-medium text-ink">
                ¿Realizas actividad empresarial?
              </p>
              <SegmentedControl
                value={
                  data.doesBusinessActivity === null
                    ? null
                    : data.doesBusinessActivity
                      ? "yes"
                      : "no"
                }
                onChange={(v) => update({ doesBusinessActivity: v === "yes" })}
                options={[
                  { value: "yes", label: "Sí, realizo actividad empresarial" },
                  { value: "no", label: "No, no realizo actividad empresarial" },
                ]}
              />
            </div>
          )}

          <p className="text-[13px] text-ink-3">
            Esto determina qué documentos necesitarás para completar tu registro.
          </p>
        </div>
      )}
    </SplitLayout>
  );
}

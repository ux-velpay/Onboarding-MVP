"use client";

import { Button } from "@/components/ui/Button";
import { SelectField } from "@/components/ui/SelectField";
import { TextField } from "@/components/ui/TextField";
import { REGIMENES_FISCALES } from "@/lib/catalogs";
import { resolveScenario } from "@/lib/rules-engine";
import { SplitLayout } from "../SplitLayout";
import { WizardHeader } from "../WizardHeader";
import { useOnboarding } from "../provider";
import { StepTitle } from "./StepTitle";

export function TaxData() {
  const { data, update, next } = useOnboarding();
  const scenario = resolveScenario(data);
  const isPM = scenario === "PM";

  const complete = isPM
    ? data.razonSocial.trim() !== "" && data.rfc.trim() !== ""
    : data.nombreCompleto.trim() !== "" && data.rfc.trim() !== "";

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
        title="Datos fiscales"
        subtitle={isPM ? "Persona moral" : "Persona física"}
      />

      <div className="space-y-5">
        {isPM ? (
          <>
            <TextField
              label="Razón social (requerido)"
              placeholder="Velpay Tecnologías S.A. de C.V."
              value={data.razonSocial}
              onChange={(e) => update({ razonSocial: e.target.value })}
            />
            <TextField
              label="RFC de la persona moral (requerido)"
              placeholder="VTE220412KJ9"
              value={data.rfc}
              onChange={(e) => update({ rfc: e.target.value.toUpperCase() })}
              hint="Formato válido de 12 caracteres. Se valida contra tu razón social."
            />
            <SelectField
              label="Régimen fiscal"
              placeholder="Selecciona un régimen"
              options={REGIMENES_FISCALES}
              value={data.regimenFiscal}
              onChange={(e) => update({ regimenFiscal: e.target.value })}
            />
            <TextField
              label="Domicilio fiscal"
              placeholder="Av. Reforma 405, Piso 12, Ciudad de México"
              value={data.domicilioFiscal}
              onChange={(e) => update({ domicilioFiscal: e.target.value })}
            />

            <div className="border-t border-line pt-5">
              <h3 className="mb-4 text-[17px] font-medium text-ink">
                Representante legal
              </h3>
              <TextField
                label="Nombre completo del representante"
                placeholder="David Alejandro Gómez"
                value={data.representanteLegal}
                onChange={(e) => update({ representanteLegal: e.target.value })}
              />
              <p className="mt-3 text-[13px] text-ink-3">
                En el expediente requeriremos acta constitutiva y poderes del
                representante legal.
              </p>
            </div>
          </>
        ) : (
          <>
            <TextField
              label="Nombre completo (requerido)"
              placeholder="Ana María Rodríguez"
              value={data.nombreCompleto}
              onChange={(e) => update({ nombreCompleto: e.target.value })}
            />
            <TextField
              label="RFC (requerido)"
              placeholder="ROMA850312HN4"
              value={data.rfc}
              onChange={(e) => update({ rfc: e.target.value.toUpperCase() })}
              hint="Formato válido de 13 caracteres. Se valida contra tu nombre."
            />
            {scenario === "PF_CON_ACTIVIDAD" && (
              <SelectField
                label="Régimen fiscal"
                placeholder="Selecciona un régimen"
                options={REGIMENES_FISCALES}
                value={data.regimenFiscal}
                onChange={(e) => update({ regimenFiscal: e.target.value })}
              />
            )}
            <TextField
              label={
                scenario === "PF_CON_ACTIVIDAD" ? "Domicilio fiscal" : "Domicilio particular"
              }
              placeholder="Calle Primavera 22, Ciudad de México"
              value={data.domicilioFiscal}
              onChange={(e) => update({ domicilioFiscal: e.target.value })}
            />
          </>
        )}
      </div>
    </SplitLayout>
  );
}

"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { scenarioOf } from "@/lib/documents";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, Check } from "@/components/ui/icons";
import { SplitLayout } from "../SplitLayout";
import { WizardHeader } from "../WizardHeader";
import { useOnboarding } from "../provider";
import { StepTitle } from "./StepTitle";
import type { OnboardingData } from "@/lib/types";

interface Discrepancy {
  id: string;
  field: string;
  options: { source: string; value: string }[];
  apply: (value: string) => Partial<OnboardingData>;
}

/** Build the (simulated) discrepancies the OCR found across documents. */
function discrepanciesFor(data: OnboardingData): Discrepancy[] {
  const sc = scenarioOf(data);
  const list: Discrepancy[] = [];
  const isPM = sc === "PM_RFC";

  // Name / Razón social — appears in INE, CSF, Estado de cuenta.
  if (data.documentsDone.ine && data.documentsDone.estado_cuenta) {
    list.push(
      isPM
        ? {
            id: "razon",
            field: "Razón social",
            options: [
              { source: "Constancia de Situación Fiscal", value: "Velpay Tecnologías S.A. de C.V." },
              { source: "Estado de cuenta", value: "Velpay Tecnologias SA de CV" },
            ],
            apply: (v) => ({ razonSocial: v }),
          }
        : {
            id: "nombre",
            field: "Nombre completo",
            options: [
              { source: "INE", value: "Ana María Rodríguez López" },
              { source: "Estado de cuenta", value: "Ana M. Rodríguez L." },
            ],
            apply: (v) => {
              const parts = v.split(" ");
              return {
                nombres: parts.slice(0, parts.length - 2).join(" ") || v,
                apellidoPaterno: parts[parts.length - 2] ?? "",
                apellidoMaterno: parts[parts.length - 1] ?? "",
              };
            },
          }
    );
  }

  // Domicilio — appears in Comprobante, CSF (or INE for PF sin RFC).
  if (data.documentsDone.comprobante) {
    const otherSource = sc === "PF_SIN_RFC" ? "INE" : "Constancia de Situación Fiscal";
    list.push({
      id: "domicilio",
      field: "Domicilio",
      options: [
        { source: "Comprobante de domicilio", value: "Calle Primavera 22, Col. Del Valle, CDMX" },
        { source: otherSource, value: "Av. Reforma 405, Piso 12, CDMX" },
      ],
      apply: (v) => ({ domicilioFiscal: v }),
    });
  }

  return list;
}

export function CrossCheck() {
  const { data, update, next } = useOnboarding();
  const discrepancies = discrepanciesFor(data);
  const [choice, setChoice] = useState<Record<string, number>>(() =>
    Object.fromEntries(discrepancies.map((d) => [d.id, 0]))
  );

  function confirm() {
    let patch: Partial<OnboardingData> = {};
    for (const d of discrepancies) {
      const picked = d.options[choice[d.id] ?? 0];
      patch = { ...patch, ...d.apply(picked.value) };
    }
    update(patch);
    next();
  }

  if (discrepancies.length === 0) {
    return (
      <SplitLayout
        header={<WizardHeader />}
        footer={
          <Button fullWidth onClick={next}>
            Continuar
          </Button>
        }
      >
        <span className="mb-6 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-success-bg text-success">
          <Check width={26} height={26} />
        </span>
        <StepTitle
          title="Tus documentos coinciden"
          subtitle="No encontramos diferencias en los datos de tus documentos. Puedes continuar."
        />
      </SplitLayout>
    );
  }

  return (
    <SplitLayout
      align="start"
      header={<WizardHeader />}
      footer={
        <Button fullWidth onClick={confirm}>
          Confirmar y continuar
        </Button>
      }
    >
      <StepTitle
        title="Confirma la información de tus documentos"
        subtitle="Algunos datos aparecen distintos entre tus documentos. Elige el valor correcto para cada uno."
      />
      <div className="space-y-4">
        {discrepancies.map((d) => (
          <div key={d.id} className="rounded-[14px] border border-line bg-white p-4">
            <div className="mb-3 flex items-center gap-2 text-[14px] font-medium text-ink">
              <AlertTriangle className="text-alert" width={16} height={16} />
              {d.field}
            </div>
            <div className="space-y-2">
              {d.options.map((opt, i) => {
                const selected = (choice[d.id] ?? 0) === i;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setChoice((c) => ({ ...c, [d.id]: i }))}
                    className={cn(
                      "focus-ring flex w-full items-center gap-3 rounded-[10px] border px-3.5 py-3 text-left transition-colors",
                      selected ? "border-primary bg-purple-50" : "border-line hover:border-line-strong"
                    )}
                  >
                    <span
                      className={cn(
                        "relative flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2",
                        selected ? "border-primary" : "border-line-strong"
                      )}
                    >
                      {selected && <span className="h-2 w-2 rounded-full bg-primary" />}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[15px] text-ink">{opt.value}</span>
                      <span className="block text-[12px] text-ink-3">según tu {opt.source}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </SplitLayout>
  );
}

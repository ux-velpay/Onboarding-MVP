"use client";

import { Button } from "@/components/ui/Button";
import { DocumentRow } from "@/components/ui/DocumentRow";
import {
  applyDocumentProgress,
  buildRequirements,
  requirementProgress,
} from "@/lib/rules-engine";
import { SplitLayout } from "../SplitLayout";
import { useOnboarding } from "../provider";
import { StepTitle } from "./StepTitle";

export function DocumentChecklist() {
  const { data, update, next } = useOnboarding();
  const reqs = applyDocumentProgress(buildRequirements(data), data.documentsDone);
  const percent = requirementProgress(reqs);

  function markDone(id: string) {
    update({ documentsDone: { ...data.documentsDone, [id]: true } });
  }

  return (
    <SplitLayout
      align="start"
      header={
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-semibold text-primary">
              Expediente de Registro
            </span>
            <span className="text-[15px] font-semibold text-success">{percent}% listo</span>
          </div>
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-success transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      }
      footer={
        <Button variant="secondary" fullWidth onClick={next}>
          Continuar
        </Button>
      }
    >
      <StepTitle
        title="Completa tu expediente"
        subtitle="Necesitamos estos documentos para continuar con tu solicitud de afiliación."
      />
      <div className="space-y-3">
        {reqs.map((r) => (
          <DocumentRow
            key={r.id}
            label={r.label}
            status={r.status}
            onUpload={() => markDone(r.id)}
          />
        ))}
      </div>
    </SplitLayout>
  );
}

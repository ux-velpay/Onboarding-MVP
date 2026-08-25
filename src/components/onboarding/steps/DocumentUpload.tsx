"use client";

import { Button } from "@/components/ui/Button";
import { UploadDropzone } from "@/components/ui/UploadDropzone";
import { Check } from "@/components/ui/icons";
import { SplitLayout } from "../SplitLayout";
import { WizardHeader } from "../WizardHeader";
import { useOnboarding } from "../provider";
import { StepTitle } from "./StepTitle";

const REQUIREMENTS = [
  "La imagen se vea completa y en foco",
  "Esté vigente y contenga la firma oficial",
  "Toda la información sea perfectamente legible",
];

export function DocumentUpload() {
  const { next } = useOnboarding();
  return (
    <SplitLayout
      align="start"
      header={<WizardHeader step={7} rightLabel="Subiendo Documentos" />}
      footer={
        <Button fullWidth onClick={next}>
          Continuar
        </Button>
      }
    >
      <StepTitle
        title="Sube tu identificación oficial (INE)"
        subtitle="Necesitamos ambos lados de tu INE. Asegúrate de que cada imagen cumpla con:"
      />
      <ul className="mb-6 space-y-3">
        {REQUIREMENTS.map((t) => (
          <li key={t} className="flex items-center gap-3 text-[15px] text-ink">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-dark text-white">
              <Check width={14} height={14} />
            </span>
            {t}
          </li>
        ))}
      </ul>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-[14px] font-medium text-ink">INE — Frente</p>
          <UploadDropzone />
        </div>
        <div>
          <p className="mb-2 text-[14px] font-medium text-ink">INE — Reverso</p>
          <UploadDropzone />
        </div>
      </div>
    </SplitLayout>
  );
}

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
      header={<WizardHeader step={7} rightLabel="Subiendo Documentos" />}
      footer={
        <Button fullWidth onClick={next}>
          Continuar
        </Button>
      }
    >
      <StepTitle
        title="Sube tu identificación oficial"
        subtitle="Asegúrate de que la identificación oficial (INE o Pasaporte) cumpla con:"
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
      <UploadDropzone />
    </SplitLayout>
  );
}

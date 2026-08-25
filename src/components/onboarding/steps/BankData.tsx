"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { UploadField } from "@/components/ui/UploadField";
import { SplitLayout } from "../SplitLayout";
import { WizardHeader } from "../WizardHeader";
import { useOnboarding } from "../provider";
import { StepTitle } from "./StepTitle";

export function BankData() {
  const { data, update, next } = useOnboarding();
  const [uploaded, setUploaded] = useState(false);
  const complete = data.bank.trim() !== "" && data.clabe.trim() !== "";

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
        title="Datos bancarios"
        subtitle="Necesitamos la cuenta donde se abonarán tus ventas."
      />
      <div className="space-y-5">
        <TextField
          label="Banco"
          placeholder="Banorte"
          value={data.bank}
          onChange={(e) => update({ bank: e.target.value })}
        />
        <TextField
          label="CLABE (18 dígitos)"
          inputMode="numeric"
          placeholder="072 180 0000 0000 0000"
          value={data.clabe}
          onChange={(e) => update({ clabe: e.target.value })}
        />
        <TextField
          label="Titular de la cuenta"
          placeholder="Comercializadora Velpay S.A. de C.V."
          value={data.accountHolder}
          onChange={(e) => update({ accountHolder: e.target.value })}
        />
        <p className="text-[13px] text-ink-3">
          El estado de cuenta debe mostrar el nombre del comercio.
        </p>
        <UploadField
          text="Estado de cuenta bancario — Formatos permitidos: PDF, JPG, PNG (máx. 10MB)"
          uploaded={uploaded}
          onUpload={() => setUploaded(true)}
        />
      </div>
    </SplitLayout>
  );
}

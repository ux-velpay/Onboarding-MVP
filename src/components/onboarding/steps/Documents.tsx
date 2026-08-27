"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import {
  documentsFor,
  extractedData,
  requiredDocsDone,
  type DocDef,
  type DocId,
} from "@/lib/documents";
import { Button } from "@/components/ui/Button";
import {
  Building,
  Camera,
  Check,
  FileUp,
  Home,
  IdCard,
  Landmark,
  Upload,
} from "@/components/ui/icons";
import { SplitLayout } from "../SplitLayout";
import { WizardHeader } from "../WizardHeader";
import { useOnboarding } from "../provider";
import { StepTitle } from "./StepTitle";

const ICON = {
  id: IdCard,
  home: Home,
  bank: Landmark,
  file: FileUp,
  corporate: Building,
} as const;

function Spinner() {
  return (
    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
  );
}

export function Documents() {
  const { data, update, next } = useOnboarding();
  const docs = documentsFor(data);
  const [scanning, setScanning] = useState<Record<string, boolean>>({});
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function done(key: string) {
    return Boolean(data.documentsDone[key]);
  }

  // Simulate an OCR scan: brief "scanning" state, then mark done + prefill.
  function scan(doc: DocDef, side?: "frente" | "reverso") {
    const key = side ? `${doc.id}_${side}` : doc.id;
    if (done(key) || scanning[key]) return;
    setScanning((s) => ({ ...s, [key]: true }));
    const t = window.setTimeout(() => {
      setScanning((s) => ({ ...s, [key]: false }));
      const patch = { ...data.documentsDone, [key]: true } as Record<string, boolean>;
      // INE completes only when both sides are captured.
      let extractedFor: DocId | null = doc.id;
      if (doc.twoSided) {
        const both = patch[`${doc.id}_frente`] && patch[`${doc.id}_reverso`];
        patch[doc.id] = Boolean(both);
        extractedFor = both ? doc.id : null;
      }
      update({
        documentsDone: patch,
        ...(extractedFor ? extractedData(extractedFor, data) : {}),
      });
    }, 950);
    timers.current.push(t);
  }

  const canContinue = requiredDocsDone(data);

  return (
    <SplitLayout
      align="start"
      header={<WizardHeader />}
      footer={
        <div className="space-y-3">
          <Button fullWidth disabled={!canContinue} onClick={next}>
            Continuar
          </Button>
          {!canContinue && (
            <p className="text-center text-[13px] text-ink-3">
              Sube o escanea los documentos obligatorios para continuar.
            </p>
          )}
        </div>
      }
    >
      <StepTitle
        title="Sube o escanea tus documentos"
        subtitle="Toma una foto con tu cámara y extraemos los datos por ti. Podrás confirmarlos en el siguiente paso."
      />
      <div className="space-y-3">
        {docs.map((doc) => {
          const Icon = ICON[doc.icon];
          const isDone = done(doc.id);
          const isScanning = scanning[doc.id];
          return (
            <div
              key={doc.id}
              className={cn(
                "rounded-[14px] border p-4 transition-colors",
                isDone ? "border-success/40 bg-success-bg/40" : "border-line bg-white"
              )}
            >
              <div className="flex items-start gap-3.5">
                <span
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                    isDone ? "bg-success-bg text-success" : "bg-page text-ink-2"
                  )}
                >
                  {isDone ? <Check width={20} height={20} /> : <Icon width={20} height={20} />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[15px] font-medium text-ink">{doc.title}</p>
                    {!doc.required && !isDone && (
                      <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[11px] font-medium text-primary">
                        Opcional
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[13px] leading-snug text-ink-3">
                    {isDone ? "Documento detectado y datos extraídos ✓" : doc.desc}
                  </p>

                  {/* Actions */}
                  {!isDone && (
                    <div className="mt-3">
                      {doc.twoSided ? (
                        <div className="flex flex-wrap gap-2">
                          {(["frente", "reverso"] as const).map((side) => {
                            const k = `${doc.id}_${side}`;
                            const sideDone = done(k);
                            const sideScan = scanning[k];
                            return (
                              <button
                                key={side}
                                type="button"
                                onClick={() => scan(doc, side)}
                                disabled={sideDone || sideScan}
                                className={cn(
                                  "focus-ring inline-flex items-center gap-2 rounded-[9px] border px-3 py-2 text-[13px] font-medium transition-colors",
                                  sideDone
                                    ? "border-success/40 bg-success-bg text-success"
                                    : "border-line-strong bg-white text-ink hover:bg-page"
                                )}
                              >
                                {sideScan ? (
                                  <Spinner />
                                ) : sideDone ? (
                                  <Check width={15} height={15} />
                                ) : (
                                  <Camera width={15} height={15} />
                                )}
                                {side === "frente" ? "Frente" : "Reverso"}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => scan(doc)}
                            disabled={isScanning}
                            className="focus-ring inline-flex items-center gap-2 rounded-[9px] bg-primary-dark px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-70"
                          >
                            {isScanning ? <Spinner /> : <Camera width={15} height={15} />}
                            {isScanning ? "Escaneando…" : "Escanear"}
                          </button>
                          <button
                            type="button"
                            onClick={() => scan(doc)}
                            disabled={isScanning}
                            className="focus-ring inline-flex items-center gap-2 rounded-[9px] border border-line-strong bg-white px-3.5 py-2 text-[13px] font-medium text-ink transition-colors hover:bg-page"
                          >
                            <Upload width={15} height={15} />
                            Subir
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {data.personType === "PM" && (
        <p className="mt-4 rounded-[12px] bg-surface p-4 text-[13px] leading-relaxed text-ink-2">
          El acta constitutiva es opcional aquí. Si no la tienes a la mano, tu registro
          continúa y podrás subirla más adelante desde el Assistant.
        </p>
      )}
    </SplitLayout>
  );
}

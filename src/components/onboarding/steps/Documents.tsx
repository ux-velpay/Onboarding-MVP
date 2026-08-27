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
  photo: Camera,
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
  const [errored, setErrored] = useState<Record<string, boolean>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function done(key: string) {
    return Boolean(data.documentsDone[key]);
  }

  // Simulate an OCR scan / photo capture: brief "scanning" state, then mark
  // done + prefill. `slot` is 0/1 for the two-capture docs (INE sides, photos).
  function scan(doc: DocDef, slot?: number) {
    const key = slot !== undefined ? `${doc.id}_${slot}` : doc.id;
    if (done(key) || scanning[key]) return;
    const attempt = (attempts[key] ?? 0) + 1;
    setAttempts((a) => ({ ...a, [key]: attempt }));
    setErrored((e) => ({ ...e, [key]: false }));
    setScanning((s) => ({ ...s, [key]: true }));
    const t = window.setTimeout(() => {
      setScanning((s) => ({ ...s, [key]: false }));
      // Deterministic demo: the comprobante fails to read on the first try
      // (blurry image) so the re-upload flow can be shown.
      if (doc.id === "comprobante" && attempt === 1) {
        setErrored((e) => ({ ...e, [key]: true }));
        return;
      }
      const patch = { ...data.documentsDone, [key]: true } as Record<string, boolean>;
      // Two-capture docs complete only when both captures are done.
      let extractedFor: DocId | null = doc.id;
      if (doc.twoSided) {
        const both = patch[`${doc.id}_0`] && patch[`${doc.id}_1`];
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
                errored[doc.id]
                  ? "border-danger/50 bg-danger-bg/20"
                  : isDone
                    ? "border-success/40 bg-success-bg/40"
                    : "border-line bg-white"
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
                  <p
                    className={cn(
                      "mt-0.5 text-[13px] leading-snug",
                      errored[doc.id] ? "text-danger" : "text-ink-3"
                    )}
                  >
                    {errored[doc.id]
                      ? "No pudimos leer el documento (imagen borrosa). Vuelve a cargarlo."
                      : isDone
                        ? doc.photos
                          ? "Fotos cargadas ✓"
                          : "Documento detectado y datos extraídos ✓"
                        : doc.desc}
                  </p>

                  {/* Actions */}
                  {!isDone && (
                    <div className="mt-3">
                      {doc.twoSided ? (
                        <div className="flex flex-wrap gap-2">
                          {(doc.sides ?? ["Frente", "Reverso"]).map((label, i) => {
                            const k = `${doc.id}_${i}`;
                            const sideDone = done(k);
                            const sideScan = scanning[k];
                            return (
                              <button
                                key={label}
                                type="button"
                                onClick={() => scan(doc, i)}
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
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      ) : errored[doc.id] ? (
                        <button
                          type="button"
                          onClick={() => scan(doc)}
                          disabled={isScanning}
                          className="focus-ring inline-flex items-center gap-2 rounded-[9px] border border-danger/50 bg-white px-3.5 py-2 text-[13px] font-medium text-danger transition-colors hover:bg-danger-bg/40"
                        >
                          {isScanning ? <Spinner /> : <Upload width={15} height={15} />}
                          {isScanning ? "Escaneando…" : "Volver a cargar"}
                        </button>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {!doc.uploadOnly && (
                            <button
                              type="button"
                              onClick={() => scan(doc)}
                              disabled={isScanning}
                              className="focus-ring inline-flex items-center gap-2 rounded-[9px] bg-primary-dark px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-70"
                            >
                              {isScanning ? <Spinner /> : <Camera width={15} height={15} />}
                              {isScanning ? "Escaneando…" : "Escanear"}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => scan(doc)}
                            disabled={isScanning}
                            className="focus-ring inline-flex items-center gap-2 rounded-[9px] border border-line-strong bg-white px-3.5 py-2 text-[13px] font-medium text-ink transition-colors hover:bg-page disabled:opacity-70"
                          >
                            {doc.uploadOnly && isScanning ? <Spinner /> : <Upload width={15} height={15} />}
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

    </SplitLayout>
  );
}

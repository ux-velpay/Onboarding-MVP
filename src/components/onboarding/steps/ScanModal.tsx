"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { type DocDef } from "@/lib/documents";
import { AlertCircle, ArrowLeft, Check } from "@/components/ui/icons";
import { Button } from "@/components/ui/Button";

/* ── Types ─────────────────────────────────────────────────────────────────── */

type Phase =
  | "prep"
  | "camera"
  | "processing"
  | "ok"
  | "blurry"
  | "unrecognized"
  | "incomplete"
  | "error";

export interface ScanModalProps {
  doc: DocDef;
  /** undefined for single-capture docs; 0|1 for two-sided. */
  slot?: number;
  /** How many times this key was already scanned (for demo error logic). */
  initialAttempt?: number;
  onSuccess: (key: string) => void;
  onDismiss: () => void;
}

/* ── Root ───────────────────────────────────────────────────────────────────── */

export function ScanModal({
  doc,
  slot,
  initialAttempt = 0,
  onSuccess,
  onDismiss,
}: ScanModalProps) {
  const [phase, setPhase] = useState<Phase>("prep");
  const [progress, setProgress] = useState(0);
  const [detected, setDetected] = useState(false);
  const attemptRef = useRef(initialAttempt);

  const key = slot !== undefined ? `${doc.id}_${slot}` : doc.id;
  const label =
    slot !== undefined ? (doc.sides?.[slot] ?? `Foto ${slot + 1}`) : doc.title;

  /* Camera: detect after 1s, capture after 1.8s */
  useEffect(() => {
    if (phase !== "camera") {
      setDetected(false);
      return;
    }
    const t1 = setTimeout(() => setDetected(true), 1000);
    const t2 = setTimeout(() => setPhase("processing"), 1800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [phase]);

  /* Processing: animate bar then show result */
  useEffect(() => {
    if (phase !== "processing") return;
    setProgress(0);
    const interval = setInterval(
      () => setProgress((p) => Math.min(p + 5, 100)),
      70
    );
    const done = setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      const attempt = ++attemptRef.current;
      /* Demo: comprobante first attempt → blurry; everything else → ok */
      setPhase(doc.id === "comprobante" && attempt <= 1 ? "blurry" : "ok");
    }, 1450);
    return () => {
      clearInterval(interval);
      clearTimeout(done);
    };
  }, [phase, doc.id]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Scan-line animation — scoped to modal */}
      <style>{`
        @keyframes scan-sweep{0%{top:4px}100%{top:calc(100% - 4px)}}
        .modal-scan-line{
          position:absolute;left:0;right:0;height:2px;pointer-events:none;
          background:linear-gradient(90deg,transparent,#4ade80 50%,transparent);
          box-shadow:0 0 10px 4px rgba(74,222,128,.45);
          animation:scan-sweep 1.6s ease-in-out infinite;
        }
      `}</style>

      {phase === "prep" && (
        <PrepView
          label={label}
          isPhoto={!!doc.photos}
          onContinue={() => setPhase("camera")}
          onDismiss={onDismiss}
        />
      )}
      {phase === "camera" && (
        <CameraView label={label} detected={detected} isPhoto={!!doc.photos} />
      )}
      {phase === "processing" && <ProcessingView progress={progress} />}
      {phase === "ok" && (
        <OkView label={label} isPhoto={!!doc.photos} onContinue={() => onSuccess(key)} />
      )}
      {(phase === "blurry" ||
        phase === "unrecognized" ||
        phase === "incomplete" ||
        phase === "error") && (
        <ErrorView
          kind={phase}
          onRetry={() => setPhase("camera")}
          onDismiss={onDismiss}
        />
      )}
    </div>
  );
}

/* ── Phase: Prep ─────────────────────────────────────────────────────────────── */

function PrepView({
  label,
  isPhoto,
  onContinue,
  onDismiss,
}: {
  label: string;
  isPhoto: boolean;
  onContinue: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="flex h-full flex-col px-6 pb-10 pt-12">
      {/* Back */}
      <button
        type="button"
        onClick={onDismiss}
        className="mb-8 -ml-1 self-start p-1 text-ink-2 hover:text-ink"
      >
        <ArrowLeft width={22} height={22} />
      </button>

      {/* Illustration */}
      <div className="mb-8 flex justify-center">
        <div className="relative flex h-32 w-52 items-center justify-center rounded-2xl border-2 border-dashed border-primary/40 bg-purple-50">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6B3FF6"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isPhoto ? (
              <>
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                <circle cx="12" cy="13" r="3" />
              </>
            ) : (
              <>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
              </>
            )}
          </svg>
          {/* Corner accents */}
          <span className="absolute left-2 top-2 h-4 w-4 rounded-tl border-l-2 border-t-2 border-primary" />
          <span className="absolute right-2 top-2 h-4 w-4 rounded-tr border-r-2 border-t-2 border-primary" />
          <span className="absolute bottom-2 left-2 h-4 w-4 rounded-bl border-b-2 border-l-2 border-primary" />
          <span className="absolute bottom-2 right-2 h-4 w-4 rounded-br border-b-2 border-r-2 border-primary" />
        </div>
      </div>

      <h2 className="mb-2 text-[22px] font-semibold text-ink">
        {isPhoto
          ? `Toma una foto: ${label}`
          : `Escanea tu ${label.toLowerCase()}`}
      </h2>
      <p className="mb-8 text-[15px] text-ink-2">
        Sigue estas indicaciones para obtener el mejor resultado.
      </p>

      <ul className="mb-auto space-y-4">
        <Tip icon="frame">Coloca el documento dentro del recuadro</Tip>
        <Tip icon="light">
          Asegúrate de que el texto sea visible y esté bien iluminado
        </Tip>
        {!isPhoto && (
          <Tip icon="flat">Mantén el documento plano y sin dobleces</Tip>
        )}
      </ul>

      <div className="mt-8">
        <Button fullWidth onClick={onContinue}>
          Continuar
        </Button>
      </div>
    </div>
  );
}

function Tip({
  icon,
  children,
}: {
  icon: "frame" | "light" | "flat";
  children: React.ReactNode;
}) {
  const paths: Record<typeof icon, React.ReactNode> = {
    frame: <rect x="3" y="3" width="18" height="18" rx="3" />,
    light: (
      <>
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
      </>
    ),
    flat: (
      <>
        <rect x="2" y="8" width="20" height="12" rx="2" />
        <path d="M6 8V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3" />
      </>
    ),
  };
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-50 text-primary">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {paths[icon]}
        </svg>
      </span>
      <span className="text-[15px] text-ink">{children}</span>
    </li>
  );
}

/* ── Phase: Camera ───────────────────────────────────────────────────────────── */

function CameraView({
  label,
  detected,
  isPhoto,
}: {
  label: string;
  detected: boolean;
  isPhoto: boolean;
}) {
  return (
    <div className="flex h-full flex-col bg-neutral-950">
      {/* Top label */}
      <div className="flex items-center justify-center px-4 pb-4 pt-12">
        <span className="text-[14px] font-medium text-white/60">{label}</span>
      </div>

      {/* Viewfinder */}
      <div className="flex flex-1 items-center justify-center px-8">
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: isPhoto ? "4/3" : "1.586" }}
        >
          {/* Frame border */}
          <div
            className={cn(
              "absolute inset-0 rounded-xl border-2 transition-colors duration-500",
              detected ? "border-green-400/60" : "border-white/30"
            )}
          />

          {/* Corner brackets */}
          {(["tl", "tr", "bl", "br"] as const).map((pos) => (
            <span
              key={pos}
              className={cn(
                "absolute h-8 w-8 border-[3px] transition-colors duration-500",
                pos === "tl" &&
                  "left-0 top-0 rounded-tl-xl border-b-transparent border-r-transparent",
                pos === "tr" &&
                  "right-0 top-0 rounded-tr-xl border-b-transparent border-l-transparent",
                pos === "bl" &&
                  "bottom-0 left-0 rounded-bl-xl border-r-transparent border-t-transparent",
                pos === "br" &&
                  "bottom-0 right-0 rounded-br-xl border-l-transparent border-t-transparent",
                detected ? "border-green-400" : "border-white"
              )}
            />
          ))}

          {/* Scan line (only when not detected) */}
          {!detected && <div className="modal-scan-line" />}

          {/* Detected badge */}
          {detected && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="rounded-full bg-black/50 px-3 py-1.5 text-[13px] font-medium text-green-400">
                Documento detectado
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom hint */}
      <div className="pb-14 pt-6 text-center">
        <p
          className={cn(
            "text-[14px] transition-colors duration-500",
            detected ? "text-green-400" : "text-white/50"
          )}
        >
          {detected
            ? "Capturando…"
            : "Mantén el documento dentro del marco"}
        </p>
      </div>
    </div>
  );
}

/* ── Phase: Processing ───────────────────────────────────────────────────────── */

function ProcessingView({ progress }: { progress: number }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-8">
      {/* Circular progress */}
      <div className="relative h-16 w-16">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" fill="none" stroke="#ede9fe" strokeWidth="6" />
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="#6B3FF6"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 28}`}
            strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
            className="transition-all duration-75"
          />
        </svg>
      </div>

      <div className="w-full space-y-3 text-center">
        <p className="text-[17px] font-medium text-ink">Analizando documento…</p>
        {/* Linear bar */}
        <div className="mx-auto h-1.5 w-52 overflow-hidden rounded-full bg-purple-100">
          <div
            className="h-full rounded-full bg-primary transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[13px] text-ink-3">{Math.round(progress)}%</p>
      </div>
    </div>
  );
}

/* ── Phase: OK ───────────────────────────────────────────────────────────────── */

function OkView({
  label,
  isPhoto,
  onContinue,
}: {
  label: string;
  isPhoto: boolean;
  onContinue: () => void;
}) {
  return (
    <div className="flex h-full flex-col px-6 pb-10 pt-12">
      <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success-bg">
          <Check width={36} height={36} className="text-success" />
        </div>
        <div>
          <p className="mb-1 text-[13px] font-medium uppercase tracking-wide text-success">
            Completado
          </p>
          <h2 className="mb-2 text-[20px] font-semibold text-ink">{label}</h2>
          <p className="text-[15px] text-ink-2">
            {isPhoto
              ? "Foto cargada correctamente."
              : "Documento detectado y datos extraídos ✓"}
          </p>
        </div>
      </div>
      <Button fullWidth onClick={onContinue}>
        Continuar
      </Button>
    </div>
  );
}

/* ── Phase: Error ─────────────────────────────────────────────────────────────── */

const ERROR_COPY = {
  blurry: {
    title: "No pudimos leer el documento",
    desc: "Intenta tomar otra foto con mejor iluminación.",
    retry: "Volver a escanear",
  },
  unrecognized: {
    title: "No reconocemos este documento",
    desc: "Asegúrate de utilizar un documento válido.",
    retry: "Intentar de nuevo",
  },
  incomplete: {
    title: "El documento está parcialmente fuera del encuadre",
    desc: "Vuelve a escanearlo asegurándote de que todo el documento sea visible.",
    retry: "Volver a escanearlo",
  },
  error: {
    title: "No pudimos procesar el documento",
    desc: "Ocurrió un error técnico. Por favor intenta nuevamente.",
    retry: "Intentar de nuevo",
  },
} as const;

function ErrorView({
  kind,
  onRetry,
  onDismiss,
}: {
  kind: keyof typeof ERROR_COPY;
  onRetry: () => void;
  onDismiss: () => void;
}) {
  const c = ERROR_COPY[kind];
  return (
    <div className="flex h-full flex-col px-6 pb-10 pt-12">
      <button
        type="button"
        onClick={onDismiss}
        className="mb-8 -ml-1 self-start p-1 text-ink-2 hover:text-ink"
      >
        <ArrowLeft width={22} height={22} />
      </button>

      <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-danger-bg">
          <AlertCircle width={36} height={36} className="text-danger" />
        </div>
        <div>
          <h2 className="mb-2 text-[20px] font-semibold text-ink">{c.title}</h2>
          <p className="text-[15px] text-ink-2">{c.desc}</p>
        </div>
      </div>

      <div className="space-y-3">
        <Button fullWidth onClick={onRetry}>
          {c.retry}
        </Button>
        <Button variant="secondary" fullWidth onClick={onDismiss}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}

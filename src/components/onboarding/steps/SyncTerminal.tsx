"use client";

import { Button } from "@/components/ui/Button";
import { VelpayLogo } from "@/components/ui/VelpayLogo";
import { ArrowLeft, CreditCard, ExternalLink } from "@/components/ui/icons";
import { SplitLayout } from "../SplitLayout";
import { useOnboarding } from "../provider";
import { StepTitle } from "./StepTitle";

/** Deterministic QR-like preview (illustrative — the real code lives in Assistant). */
function QrPreview() {
  const N = 21;
  const finder = (r: number, c: number) =>
    (r < 7 && c < 7) || (r < 7 && c >= N - 7) || (r >= N - 7 && c < 7);
  const cells: React.ReactNode[] = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (finder(r, c)) continue;
      if ((r * 3 + c * 7 + r * c) % 3 === 0) {
        cells.push(<rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} rx={0.2} />);
      }
    }
  }
  const Finder = ({ x, y }: { x: number; y: number }) => (
    <g transform={`translate(${x} ${y})`}>
      <rect width={7} height={7} rx={1.4} fill="none" stroke="currentColor" strokeWidth={1} />
      <rect x={2} y={2} width={3} height={3} rx={0.6} />
    </g>
  );
  return (
    <svg viewBox={`0 0 ${N} ${N}`} width={128} height={128} fill="currentColor" role="img" aria-label="Código QR">
      {cells}
      <Finder x={0} y={0} />
      <Finder x={N - 7} y={0} />
      <Finder x={0} y={N - 7} />
    </svg>
  );
}

/**
 * Milestone tras el alta exprés (BR-034): el comercio ya está creado. Puede
 * sincronizar su terminal por QR (desde Assistant) o continuar con la carga
 * de documentos — en el orden que prefiera.
 */
export function SyncTerminal() {
  const { next, back, canGoBack } = useOnboarding();

  return (
    <SplitLayout
      align="start"
      header={
        <div>
          <VelpayLogo />
          <button
            type="button"
            onClick={back}
            disabled={!canGoBack}
            aria-label="Atrás"
            className="focus-ring mt-6 inline-flex text-primary-dark disabled:opacity-40"
          >
            <ArrowLeft width={22} height={22} />
          </button>
        </div>
      }
      footer={
        <div className="space-y-3">
          <Button fullWidth onClick={next}>
            Continuar con el registro
          </Button>
          <Button variant="ghost" fullWidth>
            <ExternalLink width={17} height={17} />
            Ir al Assistant
          </Button>
        </div>
      }
    >
      <StepTitle
        title="¡Listo! Tu comercio ya está creado"
        subtitle="Ya puedes activar tu terminal para empezar a cobrar, o continuar con tu registro. Puedes hacer ambas cosas, en el orden que prefieras."
      />

      {/* Terminal sync card */}
      <div className="rounded-[16px] border border-line bg-purple-50/50 p-5">
        <div className="mb-4 flex items-center gap-2 text-[14px] font-medium text-primary-dark">
          <CreditCard width={18} height={18} />
          Sincroniza tu terminal
        </div>
        <div className="flex justify-center">
          <div className="rounded-[14px] border border-line bg-white p-4 text-primary-dark shadow-[var(--shadow-card)]">
            <QrPreview />
          </div>
        </div>
        <p className="mt-4 text-center text-[14px] leading-relaxed text-ink-2">
          Consulta este código QR en{" "}
          <span className="font-medium text-primary-dark">Velpay Assistant</span> para
          activar tu terminal y empezar a recibir pagos hoy mismo.
        </p>
      </div>

      <p className="mt-5 text-center text-[13px] leading-relaxed text-ink-3">
        ¿Prefieres terminar tu registro primero? Sube tus documentos para completar tu
        expediente y asegurar tu cuenta.
      </p>
    </SplitLayout>
  );
}

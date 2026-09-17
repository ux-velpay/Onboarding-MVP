"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { VelpayLogo } from "@/components/ui/VelpayLogo";
import { Check, ExternalLink } from "@/components/ui/icons";
import { isGiroBlocked } from "@/lib/rules-engine";
import { SplitLayout } from "../SplitLayout";
import { useOnboarding } from "../provider";

function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white gap-8">
      <VelpayLogo />
      <p className="text-[15px] text-ink-3">Abriendo Velpay Assistant…</p>
      <div className="flex items-center gap-2.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-primary"
            style={{ animation: "vp-dot 1.2s ease-in-out infinite", animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
      <style>{`
        @keyframes vp-dot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40%            { transform: scale(1);   opacity: 1;   }
        }
      `}</style>
    </div>
  );
}

export function Activated() {
  const { data, reset } = useOnboarding();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const held = isGiroBlocked(data.giroId);

  const handleFinalizar = () => {
    reset();
    router.push("/dashboard/desarrolladores");
  };

  const handleAssistant = () => {
    setLoading(true);
    setTimeout(() => router.push("/dashboard/desarrolladores"), 2000);
  };

  return (
    <>
      {loading && <LoadingOverlay />}
      <SplitLayout
        align="start"
        header={<VelpayLogo />}
        footer={
          <Button variant="secondary" fullWidth onClick={handleFinalizar}>
            Finalizar
          </Button>
        }
      >
        {/* Success icon */}
        <div
          className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-success-bg"
          style={{ animation: "vp-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both" }}
        >
          <Check
            width={24}
            height={24}
            className="text-success"
            style={{ animation: "vp-check 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both" }}
          />
        </div>
        <style>{`
          @keyframes vp-pop {
            from { transform: scale(0.4); opacity: 0; }
            to   { transform: scale(1);   opacity: 1; }
          }
          @keyframes vp-check {
            from { transform: scale(0.3) rotate(-15deg); opacity: 0; }
            to   { transform: scale(1)   rotate(0deg);   opacity: 1; }
          }
        `}</style>

        {/* Heading */}
        <h1 style={{ lineHeight: "120%" }} className="text-[26px] font-bold text-[#292828]">
          {held
            ? "Estamos revisando la información de tu negocio"
            : "¡Felicidades! Completaste tu registro"}
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-3">
          {held
            ? "Tu registro se creó correctamente. Nuestro equipo revisará los datos de tu negocio antes de activar el procesamiento de pagos. Te avisaremos por correo en 24–48 horas hábiles."
            : "Recibimos correctamente tu información. La revisaremos y te notificaremos cuando tu cuenta esté lista."}
        </p>

        {/* Terminal card — happy path only */}
        {!held && (
          <div className="mt-8 rounded-2xl bg-surface p-5">
            <p className="text-[15px] font-medium text-ink">¿Ya tienes tu terminal?</p>
            <p className="mt-1.5 text-[14px] leading-relaxed text-ink-3">
              Si aún no la has vinculado, puedes configurarla desde VelPay Assistant.
            </p>
            <button
              type="button"
              onClick={handleAssistant}
              disabled={loading}
              className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-primary transition-colors hover:text-primary-hover disabled:opacity-50"
            >
              <ExternalLink width={15} height={15} />
              Abrir VelPay Assistant
            </button>
          </div>
        )}
      </SplitLayout>
    </>
  );
}

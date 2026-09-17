"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { VelpayLogo } from "@/components/ui/VelpayLogo";
import { ExternalLink } from "@/components/ui/icons";
import { SplitLayout } from "../SplitLayout";
import { useOnboarding } from "../provider";

function Smartphone({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2.5" />
      <path d="M11 18h2" />
    </svg>
  );
}

/** Full-screen loading overlay with 3-dot animation. */
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


export function SyncTerminal() {
  const { next } = useOnboarding();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleOpen = () => {
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
          <div className="space-y-4">
            <p className="text-center text-[13px] leading-relaxed text-ink-3">
              ¿Prefieres terminar tu registro primero? Sube tus documentos para completar
              tu expediente y asegurar tu cuenta.
            </p>
            <Button variant="secondary" fullWidth onClick={next}>
              Continuar con el registro
            </Button>
          </div>
        }
      >
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-[22px] font-medium text-[#292828] leading-[116%] mb-3">
            ¡Felicidades! Tu cuenta del comercio ya está creado.
          </h1>
          <p className="text-[15px] leading-relaxed text-ink-3">
            Ya puedes activar tu terminal para empezar a cobrar, o continuar con tu registro.
          </p>
        </div>

        {/* Terminal card */}
        <div className="rounded-2xl bg-surface p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
              <Smartphone size={20} />
            </div>
            <p className="text-[15px] font-medium text-ink">¿Ya tienes tu terminal?</p>
          </div>
          <p className="text-[14px] leading-relaxed text-ink-3 mb-4">
            Si aún no la has vinculado, puedes configurarla desde VelPay Assistant.
          </p>
          <button
            type="button"
            onClick={handleOpen}
            disabled={loading}
            className="inline-flex items-center gap-2 text-[14px] font-medium text-primary hover:text-primary-hover transition-colors disabled:opacity-50"
          >
            <ExternalLink width={16} height={16} />
            Abrir Velpay Assistant
          </button>
        </div>
      </SplitLayout>
    </>
  );
}

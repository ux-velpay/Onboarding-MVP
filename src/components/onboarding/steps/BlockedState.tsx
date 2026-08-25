"use client";

import { Button } from "@/components/ui/Button";
import { IconBadge } from "@/components/ui/IconBadge";
import { AlertTriangle } from "@/components/ui/icons";
import { giroBlockReason } from "@/lib/rules-engine";
import { CenteredLayout } from "../CenteredLayout";
import { useOnboarding } from "../provider";

export function BlockedState() {
  const { data, go, reset } = useOnboarding();
  const reason =
    giroBlockReason(data.giroId) ??
    "La actividad seleccionada no está disponible para este tipo de servicio.";

  return (
    <CenteredLayout>
      <div className="mb-6 flex justify-center">
        <IconBadge icon={AlertTriangle} tone="danger" />
      </div>
      <h2 className="text-[22px] font-bold text-ink">
        No podemos continuar con el registro
      </h2>
      <p className="mx-auto mt-2 max-w-[360px] text-[15px] leading-relaxed text-ink-3">
        {reason}
      </p>
      <div className="mt-8 space-y-4">
        <Button fullWidth onClick={() => go("activity")}>
          Elegir otra actividad
        </Button>
        <button
          type="button"
          onClick={reset}
          className="focus-ring w-full text-[15px] font-semibold text-primary"
        >
          Salir
        </button>
      </div>
    </CenteredLayout>
  );
}

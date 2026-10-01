"use client";

import { Button } from "@/components/ui/Button";
import { RadioCard } from "@/components/ui/RadioCard";
import { VOLUME_RANGES } from "@/lib/catalogs";
import { useOnboarding } from "../provider";
import { AuthScreen, AuthTitle } from "./AuthScreen";

export function Business() {
  const { data, update, next, back } = useOnboarding();

  return (
    <AuthScreen
      stage={3}
      onBack={back}
      footer={
        <Button variant="secondary" fullWidth disabled={!data.volumeRangeId} onClick={next}>
          Continuar
        </Button>
      }
    >
      <AuthTitle>Volumen mensual de ventas</AuthTitle>
      <p className="mt-2 mb-6 text-[15px] leading-relaxed text-ink-3">
        ¿Cuánto esperas vender al mes? Selecciona el volumen aproximado de ventas.
      </p>
      <div className="space-y-3">
        {VOLUME_RANGES.map((r) => (
          <RadioCard
            key={r.id}
            selected={data.volumeRangeId === r.id}
            onSelect={() => update({ volumeRangeId: r.id })}
            title={r.label}
          />
        ))}
      </div>
    </AuthScreen>
  );
}

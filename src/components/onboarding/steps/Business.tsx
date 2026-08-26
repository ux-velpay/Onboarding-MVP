"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { RadioCard } from "@/components/ui/RadioCard";
import { TextField } from "@/components/ui/TextField";
import { activityIcon } from "@/components/ui/icons";
import { ACTIVITIES, ALL_ACTIVITIES, VOLUME_RANGES, getActivity } from "@/lib/catalogs";
import { SplitLayout } from "../SplitLayout";
import { WizardHeader } from "../WizardHeader";
import { useOnboarding } from "../provider";
import { StepTitle } from "./StepTitle";

export function Business() {
  const { data, update, next } = useOnboarding();
  const [query, setQuery] = useState("");

  const results =
    query.trim() === ""
      ? ACTIVITIES
      : ALL_ACTIVITIES.filter((a) =>
          `${a.label} ${a.description}`.toLowerCase().includes(query.toLowerCase())
        );

  function selectActivity(id: string) {
    const activity = getActivity(id);
    update({ activityId: id, giroId: activity?.giroId ?? null });
  }

  const complete = Boolean(data.activityId && data.volumeRangeId);

  return (
    <SplitLayout
      align="start"
      header={<WizardHeader />}
      footer={
        <Button fullWidth disabled={!complete} onClick={next}>
          Continuar
        </Button>
      }
    >
      <StepTitle title="Sobre tu negocio" />

      <p className="mb-3 text-[15px] font-medium text-ink">
        ¿A qué se dedica tu negocio?
      </p>
      <TextField
        placeholder="Buscar actividad..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="mt-3 space-y-3">
        {results.map((a) => (
          <RadioCard
            key={a.id}
            selected={data.activityId === a.id}
            onSelect={() => selectActivity(a.id)}
            icon={activityIcon[a.icon]}
            title={a.label}
            description={a.description}
          />
        ))}
        {results.length === 0 && (
          <p className="text-[14px] text-ink-3">Sin resultados para “{query}”.</p>
        )}
      </div>

      <div className="mt-8 border-t border-line pt-6">
        <p className="mb-3 text-[15px] font-medium text-ink">
          ¿Cuánto esperas vender al mes?
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
      </div>
    </SplitLayout>
  );
}

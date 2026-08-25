"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { RadioCard } from "@/components/ui/RadioCard";
import { TextField } from "@/components/ui/TextField";
import { activityIcon } from "@/components/ui/icons";
import { ACTIVITIES, ALL_ACTIVITIES, getActivity } from "@/lib/catalogs";
import { SplitLayout } from "../SplitLayout";
import { WizardHeader } from "../WizardHeader";
import { useOnboarding } from "../provider";
import { StepTitle } from "./StepTitle";

export function BusinessActivity() {
  const { data, update, next } = useOnboarding();
  const [query, setQuery] = useState("");

  const results =
    query.trim() === ""
      ? ACTIVITIES
      : ALL_ACTIVITIES.filter((a) =>
          `${a.label} ${a.description}`.toLowerCase().includes(query.toLowerCase())
        );

  function select(id: string) {
    const activity = getActivity(id);
    update({ activityId: id, giroId: activity?.giroId ?? null });
  }

  return (
    <SplitLayout
      header={<WizardHeader />}
      footer={
        <Button fullWidth disabled={!data.activityId} onClick={next}>
          Continuar
        </Button>
      }
    >
      <StepTitle title="¿A qué se dedica tu negocio?" />
      <TextField
        placeholder="Buscar actividad..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <p className="mb-3 mt-5 text-[13px] font-medium text-ink-3">
        {query.trim() ? "Resultados" : "Actividades sugeridas"}
      </p>
      <div className="space-y-3">
        {results.map((a) => (
          <RadioCard
            key={a.id}
            selected={data.activityId === a.id}
            onSelect={() => select(a.id)}
            icon={activityIcon[a.icon]}
            title={a.label}
            description={a.description}
          />
        ))}
        {results.length === 0 && (
          <p className="text-[14px] text-ink-3">Sin resultados para “{query}”.</p>
        )}
      </div>
    </SplitLayout>
  );
}

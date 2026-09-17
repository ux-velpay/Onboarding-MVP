"use client";

import { Button } from "@/components/ui/Button";
import { RadioCard } from "@/components/ui/RadioCard";
import { Building, UserIcon } from "@/components/ui/icons";
import { useOnboarding } from "../provider";
import { AuthScreen, AuthTitle } from "./AuthScreen";

export function PersonType() {
  const { data, update, next } = useOnboarding();

  return (
    <AuthScreen
      stage={1}
      footer={
        <Button variant="secondary" fullWidth disabled={!data.personType} onClick={next}>
          Continuar
        </Button>
      }
    >
      <AuthTitle>¿Cómo está registrado tu negocio?</AuthTitle>
      <p className="mt-2 mb-6 text-[15px] leading-relaxed text-ink-3">
        Con tus documentos extraemos y validamos el resto de tus datos.
      </p>

      <div className="space-y-3">
        <RadioCard
          selected={data.personType === "PF"}
          onSelect={() => update({ personType: "PF" })}
          icon={UserIcon}
          title="Persona física / emprendedor"
          description="Realizo actividades comerciales de manera individual o independiente"
        />
        <RadioCard
          selected={data.personType === "PM"}
          onSelect={() => update({ personType: "PM" })}
          icon={Building}
          title="Persona moral / empresa"
          description="Empresa constituida como sociedad mercantil o asociación civil"
        />
      </div>
    </AuthScreen>
  );
}

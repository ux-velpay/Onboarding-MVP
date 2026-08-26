"use client";

import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { useOnboarding } from "../provider";
import { AuthScreen, AuthTitle } from "./AuthScreen";

export function AuthEmail() {
  const { data, update, next } = useOnboarding();
  const complete = data.accountContact.trim() !== "";

  return (
    <AuthScreen step={1}>
      <AuthTitle>
        Ingresa tu dirección de correo o teléfono para crear una cuenta Velpay
      </AuthTitle>

      <div className="mt-8">
        <TextField
          label="Correo electrónico o número de teléfono"
          placeholder="E-mail / número de teléfono"
          value={data.accountContact}
          onChange={(e) => update({ accountContact: e.target.value })}
        />
        <p className="mt-3 text-[14px] leading-relaxed text-ink-2">
          Al ingresar tu correo, aceptas el{" "}
          <span className="font-medium text-primary underline">aviso de privacidad</span> y{" "}
          <span className="font-medium text-primary underline">términos y condiciones.</span>
        </p>
      </div>

      <div className="mt-8 space-y-4 text-center">
        <Button variant="secondary" fullWidth disabled={!complete} onClick={next}>
          Continuar
        </Button>
        <p className="text-[14px] text-ink-2">
          ¿Ya estás registrado?{" "}
          <span className="font-semibold text-primary underline">Inicia sesión aquí</span>
        </p>
      </div>
    </AuthScreen>
  );
}

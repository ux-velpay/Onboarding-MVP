"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff } from "@/components/ui/icons";
import { useOnboarding } from "../provider";
import { AuthScreen, AuthTitle } from "./AuthScreen";

function PasswordField({ label }: { label: string }) {
  // Password is not persisted — kept only in local state for the prototype.
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);
  return (
    <label className="block">
      <span className="mb-2 block text-[14px] font-medium text-ink">{label}</span>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="••••••••"
          className="focus-ring h-[52px] w-full rounded-[10px] border border-line bg-white px-4 pr-12 text-[15px] text-ink placeholder:text-placeholder"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Ocultar" : "Mostrar"}
          className="focus-ring absolute right-3 top-1/2 -translate-y-1/2 text-ink-3"
        >
          {show ? <Eye width={20} height={20} /> : <EyeOff width={20} height={20} />}
        </button>
      </div>
    </label>
  );
}

export function AuthPassword() {
  const { next } = useOnboarding();

  return (
    <AuthScreen step={3}>
      <AuthTitle>
        ¡Muy bien!
        <br />
        Ingresa tus nuevas credenciales
      </AuthTitle>

      <div className="mt-8 space-y-5">
        <PasswordField label="Nueva contraseña" />
        <PasswordField label="Confirmación de nueva contraseña" />
      </div>

      <div className="mt-8">
        <Button fullWidth onClick={next}>
          Continuar
        </Button>
      </div>
    </AuthScreen>
  );
}

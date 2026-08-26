"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "@/components/ui/icons";
import { useOnboarding } from "../provider";
import { AuthScreen, AuthTitle } from "./AuthScreen";

export function AuthOtp() {
  const { data, next, back } = useOnboarding();
  const [code, setCode] = useState(["", "", "", ""]);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  function setDigit(i: number, v: string) {
    const digit = v.replace(/\D/g, "").slice(-1);
    setCode((c) => {
      const nc = [...c];
      nc[i] = digit;
      return nc;
    });
    if (digit && i < 3) inputs.current[i + 1]?.focus();
  }

  function onKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !code[i] && i > 0) inputs.current[i - 1]?.focus();
  }

  const complete = code.every((d) => d !== "");

  return (
    <AuthScreen step={2}>
      <button
        type="button"
        onClick={back}
        aria-label="Atrás"
        className="focus-ring mb-4 inline-flex text-primary-dark"
      >
        <ArrowLeft width={22} height={22} />
      </button>

      <AuthTitle>Enviamos un código</AuthTitle>
      <p className="mt-3 text-[15px] text-ink-2">
        Escribe el código que enviamos a{" "}
        <span className="font-medium text-primary underline">
          {data.accountContact || "tu correo"}
        </span>
      </p>

      <div className="mt-6 flex gap-3">
        {code.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              inputs.current[i] = el;
            }}
            value={d}
            inputMode="numeric"
            maxLength={1}
            onChange={(e) => setDigit(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            className="focus-ring h-16 w-16 rounded-[12px] border border-line bg-white text-center text-[24px] font-semibold text-ink"
          />
        ))}
      </div>
      <button
        type="button"
        className="focus-ring mt-4 text-[15px] font-medium text-primary underline"
      >
        Enviar de nuevo
      </button>

      <div className="mt-8">
        <Button fullWidth disabled={!complete} onClick={next}>
          Continuar
        </Button>
      </div>
    </AuthScreen>
  );
}

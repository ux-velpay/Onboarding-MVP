"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import type { Screen } from "@/lib/flow";
import { PRESETS } from "@/lib/presets";
import { useOnboarding } from "./provider";

const GROUPS: { title: string; items: { id: Screen; label: string }[] }[] = [
  {
    title: "Crear cuenta",
    items: [
      { id: "auth-email", label: "Correo / teléfono" },
      { id: "auth-otp", label: "Código (OTP)" },
      { id: "auth-password", label: "Contraseña" },
    ],
  },
  {
    title: "Registro",
    items: [
      { id: "welcome", label: "Bienvenida" },
      { id: "person-type", label: "Tipo de persona" },
      { id: "documents", label: "Documentos (escaneo)" },
      { id: "confirm", label: "Confirmar datos" },
      { id: "business", label: "Sobre tu negocio" },
      { id: "blocked", label: "Giro bloqueado" },
      { id: "high-volume-redirect", label: "Redirección > $8k" },
      { id: "complete", label: "Completado" },
    ],
  },
  {
    title: "Post-envío",
    items: [
      { id: "status-enviado", label: "Enviado" },
      { id: "status-info-adicional", label: "Info adicional" },
      { id: "status-aprobado", label: "Aprobado" },
      { id: "status-rechazado", label: "Rechazado" },
    ],
  },
];

/** Floating design-review navigator — jump to any screen. Prototype only. */
export function DemoNav() {
  const { screen, go, reset, update } = useOnboarding();
  const [open, setOpen] = useState(false);

  function applyPreset(id: string) {
    const preset = PRESETS.find((p) => p.id === id);
    if (!preset) return;
    update(preset.data);
    go("person-type");
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 print:hidden">
      {open && (
        <div className="mb-3 max-h-[70vh] w-64 overflow-y-auto rounded-[16px] border border-line bg-white p-4 shadow-[var(--shadow-lg)]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[13px] font-semibold text-ink">Vista de diseño</span>
            <button
              onClick={reset}
              className="text-[12px] font-medium text-primary hover:underline"
            >
              Reiniciar
            </button>
          </div>
          <div className="mb-3">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-3">
              Datos de ejemplo
            </p>
            <div className="space-y-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p.id)}
                  className="block w-full rounded-md border border-line bg-page px-2.5 py-1.5 text-left text-[13px] font-medium text-primary-dark transition-colors hover:bg-purple-50"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          {GROUPS.map((g) => (
            <div key={g.title} className="mb-3 last:mb-0">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-3">
                {g.title}
              </p>
              <div className="space-y-0.5">
                {g.items.map((it) => (
                  <button
                    key={it.id}
                    onClick={() => go(it.id)}
                    className={cn(
                      "block w-full rounded-md px-2.5 py-1.5 text-left text-[13px] transition-colors",
                      screen === it.id
                        ? "bg-purple-50 font-medium text-primary-dark"
                        : "text-ink-2 hover:bg-page"
                    )}
                  >
                    {it.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="focus-ring flex h-11 items-center gap-2 rounded-full bg-primary-dark px-4 text-[13px] font-medium text-white shadow-[var(--shadow-md)] transition-colors hover:bg-primary-hover"
      >
        <span className="h-2 w-2 rounded-full bg-teal" />
        {open ? "Cerrar" : "Pantallas"}
      </button>
    </div>
  );
}

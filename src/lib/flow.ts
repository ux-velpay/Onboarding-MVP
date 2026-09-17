// Wizard navigation for the optimized scan-first flow.
// The cross-validation step is NOT part of the happy path — it is only
// inserted when the OCR found a discrepancy (data.simulateDiscrepancy).

import { classifyLevel } from "./rules-engine";
import type { OnboardingData } from "./types";

export type Screen =
  | "auth-email"
  | "auth-otp"
  | "auth-password"
  | "business-data"
  | "sync-terminal"
  | "person-type"
  | "documents"
  | "cross-check"
  | "confirm"
  | "business"
  | "contact"
  | "high-volume-redirect"
  | "activated"
  | "status-enviado"
  | "status-info-adicional"
  | "status-aprobado"
  | "status-rechazado";

/**
 * Six phase-level markers for the progress bar.
 * auth-otp and auth-password are part of phase 1 (Crear cuenta).
 * person-type is part of phase 3 (Documentos).
 */
export function captureSteps(_data: OnboardingData): Screen[] {
  return [
    "auth-email",    // Paso 1 — Crear cuenta
    "business-data", // Paso 2 — Datos del negocio
    "documents",     // Paso 3 — Documentos
    "confirm",       // Paso 4 — Confirmar datos
    "business",      // Paso 5 — Volumen de transacciones
    "contact",       // Paso 6 — Datos de contacto
  ];
}

export function totalSteps(data: OnboardingData): number {
  return captureSteps(data).length;
}

export function stepNumber(screen: Screen, data: OnboardingData): number | null {
  const steps = captureSteps(data);
  const idx = steps.indexOf(screen);
  if (idx !== -1) return idx + 1;
  // Screens that belong to a phase but aren't the phase marker
  if (screen === "auth-otp" || screen === "auth-password") return 1;
  if (screen === "person-type" || screen === "cross-check") return 3;
  return null;
}

export function nextScreen(screen: Screen, data: OnboardingData): Screen {
  switch (screen) {
    case "auth-email":
      return "auth-otp";
    case "auth-otp":
      return "auth-password";
    case "auth-password":
      return "business-data";
    case "business-data":
      return "person-type";
    case "person-type":
      return "documents";
    case "documents":
      // Happy path skips cross-validation; only shown when a discrepancy exists.
      return data.simulateDiscrepancy ? "cross-check" : "confirm";
    case "cross-check":
      return "confirm";
    case "confirm":
      return "business";
    case "business":
      return classifyLevel(data) === "FUERA_DE_RANGO"
        ? "high-volume-redirect"
        : "contact";
    case "contact":
      return "activated";
    case "activated":
      return "status-enviado";
    default:
      return screen;
  }
}

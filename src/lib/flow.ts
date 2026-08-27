// Wizard navigation for the optimized scan-first flow.
// The journey is: create account (3) → business registration (4) = 7 steps.

import { classifyLevel } from "./rules-engine";
import type { OnboardingData } from "./types";

export type Screen =
  | "auth-email"
  | "auth-otp"
  | "auth-password"
  | "person-type"
  | "documents"
  | "cross-check"
  | "confirm"
  | "business"
  | "high-volume-redirect"
  | "activated"
  | "status-enviado"
  | "status-info-adicional"
  | "status-aprobado"
  | "status-rechazado";

/** Steps shown on the continuous progress bar (account + registration). */
export const CAPTURE_STEPS: Screen[] = [
  "auth-email",
  "auth-otp",
  "auth-password",
  "person-type",
  "documents",
  "cross-check",
  "confirm",
  "business",
];

export const TOTAL_STEPS = CAPTURE_STEPS.length;

export function stepNumber(screen: Screen): number | null {
  const idx = CAPTURE_STEPS.indexOf(screen);
  return idx === -1 ? null : idx + 1;
}

export function nextScreen(screen: Screen, data: OnboardingData): Screen {
  switch (screen) {
    case "auth-email":
      return "auth-otp";
    case "auth-otp":
      return "auth-password";
    case "auth-password":
      return "person-type";
    case "person-type":
      return "documents";
    case "documents":
      return "cross-check";
    case "cross-check":
      return "confirm";
    case "confirm":
      return "business";
    case "business":
      // Prohibited giro is handled internally (never a hard block for the
      // merchant): the account is created but held for Mesa de Control — that
      // neutral state is shown on the "activated" screen. Volume > $8k still
      // redirects to the Assistant.
      return classifyLevel(data) === "FUERA_DE_RANGO"
        ? "high-volume-redirect"
        : "activated";
    case "activated":
      return "status-enviado";
    default:
      return screen;
  }
}

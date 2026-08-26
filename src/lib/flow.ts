// Wizard navigation for the optimized scan-first flow.
// The journey is: create account (3) → business registration (4) = 7 steps.

import { classifyLevel, isGiroBlocked } from "./rules-engine";
import type { OnboardingData } from "./types";

export type Screen =
  | "auth-email"
  | "auth-otp"
  | "auth-password"
  | "person-type"
  | "personal-data"
  | "documents"
  | "confirm"
  | "business"
  | "blocked"
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
  "personal-data",
  "documents",
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
      return "personal-data";
    case "personal-data":
      return "documents";
    case "documents":
      return "confirm";
    case "confirm":
      // Giro is chosen on the confirm step now (BR-020 block check here).
      return isGiroBlocked(data.giroId) ? "blocked" : "business";
    case "business":
      return classifyLevel(data) === "FUERA_DE_RANGO"
        ? "high-volume-redirect"
        : "activated";
    case "activated":
      return "status-enviado";
    default:
      return screen;
  }
}

// Wizard navigation for the optimized scan-first flow.
// The journey is: create account (3) → business registration (4) = 7 steps.

import { classifyLevel, isGiroBlocked } from "./rules-engine";
import type { OnboardingData } from "./types";

export type Screen =
  | "auth-email"
  | "auth-otp"
  | "auth-password"
  | "person-type"
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
      return "documents";
    case "documents":
      return "confirm";
    case "confirm":
      return "business";
    case "business":
      if (isGiroBlocked(data.giroId)) return "blocked";
      if (classifyLevel(data) === "FUERA_DE_RANGO") return "high-volume-redirect";
      return "activated";
    case "activated":
      return "status-enviado";
    default:
      return screen;
  }
}

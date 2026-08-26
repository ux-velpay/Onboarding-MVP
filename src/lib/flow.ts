// Wizard navigation for the optimized scan-first flow.

import { classifyLevel, isGiroBlocked } from "./rules-engine";
import type { OnboardingData } from "./types";

export type Screen =
  | "welcome"
  | "person-type"
  | "documents"
  | "confirm"
  | "business"
  | "blocked"
  | "high-volume-redirect"
  | "complete"
  | "status-enviado"
  | "status-info-adicional"
  | "status-aprobado"
  | "status-rechazado";

/** Capture steps shown on the progress bar. */
export const CAPTURE_STEPS: Screen[] = [
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
    case "welcome":
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
      return "complete";
    case "complete":
      return "status-enviado";
    default:
      return screen;
  }
}

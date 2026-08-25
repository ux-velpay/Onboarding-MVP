// Wizard navigation — the screen graph and the branching logic that the
// rules engine drives (scenario, giro block, volume redirect, TNP).

import { classifyLevel, isGiroBlocked, resolveScenario, validateRfc } from "./rules-engine";
import type { OnboardingData } from "./types";

export type Screen =
  | "welcome"
  | "person-type"
  | "tax-data"
  | "rfc-error"
  | "sin-rfc-route"
  | "business-info"
  | "bank-data"
  | "activity"
  | "blocked"
  | "volume"
  | "high-volume-redirect"
  | "channel"
  | "tnp-extra-info"
  | "checklist"
  | "upload"
  | "complete"
  | "status-enviado"
  | "status-info-adicional"
  | "status-aprobado"
  | "status-rechazado";

/** Capture steps that show up as progress dots (7 total). */
export const CAPTURE_STEPS: Screen[] = [
  "person-type",
  "tax-data",
  "business-info",
  "bank-data",
  "activity",
  "volume",
  "channel",
];

export const TOTAL_STEPS = CAPTURE_STEPS.length;

/** Which dot to highlight for a given screen (1-based), or null for none. */
export function stepNumber(screen: Screen): number | null {
  const alias: Partial<Record<Screen, Screen>> = {
    "sin-rfc-route": "tax-data",
    "rfc-error": "tax-data",
    "tnp-extra-info": "channel",
  };
  const target = alias[screen] ?? screen;
  const idx = CAPTURE_STEPS.indexOf(target);
  return idx === -1 ? null : idx + 1;
}

/** Forward transition from `screen`, given current data. */
export function nextScreen(screen: Screen, data: OnboardingData): Screen {
  switch (screen) {
    case "welcome":
      return "person-type";
    case "person-type":
      return data.hasRfc === false ? "sin-rfc-route" : "tax-data";
    case "tax-data":
      return validateRfc(data).status === "inconsistent" ? "rfc-error" : "business-info";
    case "sin-rfc-route":
      return "business-info";
    case "business-info":
      return "bank-data";
    case "bank-data":
      return "activity";
    case "activity":
      return isGiroBlocked(data.giroId) ? "blocked" : "volume";
    case "volume":
      return classifyLevel(data) === "FUERA_DE_RANGO" ? "high-volume-redirect" : "channel";
    case "channel":
      return data.channel === "TNP" ? "tnp-extra-info" : "checklist";
    case "tnp-extra-info":
      return "checklist";
    case "checklist":
      return "upload";
    case "upload":
      return "complete";
    case "complete":
      return "status-enviado";
    default:
      return screen;
  }
}

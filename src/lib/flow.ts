// Wizard navigation for the optimized scan-first flow.
// The cross-validation step is NOT part of the happy path — it is only
// inserted when the OCR found a discrepancy (data.simulateDiscrepancy).

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

/** Numbered steps for the progress bar — cross-check only counts when present. */
export function captureSteps(data: OnboardingData): Screen[] {
  const steps: Screen[] = [
    "auth-email",
    "auth-otp",
    "auth-password",
    "person-type",
    "documents",
  ];
  if (data.simulateDiscrepancy) steps.push("cross-check");
  steps.push("confirm", "business");
  return steps;
}

export function totalSteps(data: OnboardingData): number {
  return captureSteps(data).length;
}

export function stepNumber(screen: Screen, data: OnboardingData): number | null {
  const idx = captureSteps(data).indexOf(screen);
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
      // Happy path skips cross-validation; only shown when a discrepancy exists.
      return data.simulateDiscrepancy ? "cross-check" : "confirm";
    case "cross-check":
      return "confirm";
    case "confirm":
      return "business";
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

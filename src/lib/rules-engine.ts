// ============================================================
//  VelPay Banorte Rules Engine — Nivel 0 / Tasa Agregador
//  Trimmed for the scan-first flow: level classification (BR-001/BR-002)
//  and prohibited-giro blocking (BR-020). Document requirements now live
//  in lib/documents.ts (fixed, scan-first list).
// ============================================================

import { getGiro, getVolumeRange } from "./catalogs";
import type { Level, OnboardingData } from "./types";

/** BR-001 / BR-002 — classify level from declared volume. */
export function classifyLevel(data: OnboardingData): Level | null {
  const range = getVolumeRange(data.volumeRangeId);
  if (!range) return null;
  return range.exceedsNivel0 ? "FUERA_DE_RANGO" : "NIVEL_0";
}

/** BR-020 — is the selected giro prohibited / high risk? */
export function isGiroBlocked(giroId: string | null): boolean {
  return Boolean(getGiro(giroId)?.blocked);
}

export function giroBlockReason(giroId: string | null): string | undefined {
  return getGiro(giroId)?.blockedReason;
}

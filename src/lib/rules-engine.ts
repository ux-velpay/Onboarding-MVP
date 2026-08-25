// ============================================================
//  VelPay Banorte Rules Engine — Nivel 0 / Tasa Agregador
//  Encodes PRD 26034-VEL-ONB business rules BR-001 … BR-020.
//  Given a merchant profile it returns: scenario, level, giro
//  validation and the dynamic requirement list (each requirement
//  keeps the rule that originated it — BR-004).
// ============================================================

import { getGiro, getVolumeRange } from "./catalogs";
import type {
  Level,
  OnboardingData,
  Requirement,
  RfcCheck,
  Scenario,
} from "./types";

/** BR-001 / BR-002 — classify level from declared volume. */
export function classifyLevel(data: OnboardingData): Level | null {
  const range = getVolumeRange(data.volumeRangeId);
  if (!range) return null;
  return range.exceedsNivel0 ? "FUERA_DE_RANGO" : "NIVEL_0";
}

/**
 * Resolve the base scenario (PRD §D4). When the merchant has no RFC the
 * SIN_RFC overlay wins (BR-008 / BR-019), regardless of person type.
 */
export function resolveScenario(data: OnboardingData): Scenario | null {
  if (data.personType === null) return null;
  if (data.hasRfc === false) return "SIN_RFC";
  if (data.personType === "PM") return "PM";
  // Persona Física
  if (data.doesBusinessActivity) return "PF_CON_ACTIVIDAD";
  return "PF_SIN_ACTIVIDAD";
}

export const SCENARIO_LABEL: Record<Scenario, string> = {
  PF_SIN_ACTIVIDAD: "Escenario 1 · Persona Física sin actividad empresarial",
  PF_CON_ACTIVIDAD: "Escenario 2 · Persona Física con actividad empresarial",
  PM: "Escenario 3 · Persona Moral",
  SIN_RFC: "Escenario 4 · Comercio sin RFC (Sub-afiliado, giro 5399)",
};

/**
 * BR-006 / BR-007 — RFC validation. Lenient by design: any RFC that roughly
 * looks valid (12–13 chars: letters + 6 digits + homoclave) passes, so the
 * prototype never blocks realistic input — including the SAT generic RFC.
 * To showcase the "inconsistent" path on purpose, type an RFC containing the
 * word "ERROR", or jump to the "Error de RFC" screen from the demo panel.
 */
export function validateRfc(data: OnboardingData): RfcCheck {
  if (data.hasRfc === false) return { status: "missing" };
  const rfc = data.rfc.replace(/\s+/g, "").toUpperCase();
  if (!rfc) return { status: "inconsistent" };

  // Intentional demo trigger for the rfc-error screen.
  if (rfc.includes("ERROR")) return { status: "inconsistent" };

  // Loose shape: 3–4 letters, 6 digits, 2–3 alphanumeric homoclave.
  const looksValid = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{2,3}$/.test(rfc);
  return looksValid ? { status: "valid" } : { status: "inconsistent" };
}

/** BR-020 — is the selected giro prohibited / high risk? */
export function isGiroBlocked(giroId: string | null): boolean {
  return Boolean(getGiro(giroId)?.blocked);
}

export function giroBlockReason(giroId: string | null): string | undefined {
  return getGiro(giroId)?.blockedReason;
}

/**
 * BR-003 / BR-017 / BR-018 / BR-019 / BR-010 — build the dynamic requirement
 * checklist. Base documents (BR-017) apply to every Nivel 0 merchant; the rest
 * are layered on by scenario and by channel. Each requirement records its rule.
 */
export function buildRequirements(data: OnboardingData): Requirement[] {
  const scenario = resolveScenario(data);
  const reqs: Requirement[] = [];

  // --- Base documents — Tasa Agregador (BR-017 / A2.1) ---
  reqs.push(
    {
      id: "id_oficial",
      label:
        scenario === "SIN_RFC"
          ? "Identificación oficial tipo pasaporte (ambos lados)"
          : "Identificación oficial vigente (ambos lados)",
      rule: scenario === "SIN_RFC" ? "BR-019" : "BR-017",
      kind: "upload",
      status: "pending",
    },
    {
      id: "contrato_subafiliado",
      label: "Contrato de sub-afiliado",
      hint: "Con firma autógrafa o digital.",
      rule: "BR-017",
      kind: "upload",
      status: "pending",
    },
    {
      id: "ventas_estimadas",
      label: "Ventas estimadas (capturado)",
      rule: "BR-017",
      kind: "captured",
      status: "done",
    },
    {
      id: "modo_operacion",
      label: "Modo de operación (capturado)",
      rule: "BR-017",
      kind: "captured",
      status: "done",
    }
  );

  // --- Additional documents by scenario (BR-018 / BR-019) ---
  switch (scenario) {
    case "PF_SIN_ACTIVIDAD":
      reqs.push({
        id: "buro_credito",
        label: "Formato de consulta de buró de crédito firmado",
        rule: "BR-018",
        kind: "upload",
        status: "pending",
      });
      break;
    case "PF_CON_ACTIVIDAD":
      reqs.push({
        id: "alta_hacienda",
        label: "Alta de Hacienda y/o RFC del comercio",
        rule: "BR-018",
        kind: "upload",
        status: "pending",
      });
      break;
    case "PM":
      reqs.push({
        id: "acta_poderes",
        label: "Acta constitutiva y poderes del representante legal",
        rule: "BR-018",
        kind: "upload",
        status: "pending",
      });
      break;
    case "SIN_RFC":
      // BR-019: no RFC is requested; giro 5399 / Anexo B are handled internally.
      reqs.push({
        id: "anexo_b",
        label: "Anexo B (Sub-afiliado sin alta de Hacienda)",
        hint: "Se genera automáticamente con el RFC de Velpay como Agregador.",
        rule: "BR-019",
        kind: "captured",
        status: "done",
      });
      break;
  }

  // --- TNP e-commerce requirements (BR-010 / BR-018) ---
  if (data.channel === "TNP") {
    reqs.push(
      {
        id: "buro_tnp",
        label: "Formato de consulta de buró de crédito firmado",
        rule: "BR-018",
        kind: "upload",
        status: "pending",
      },
      {
        id: "capturas_sitio",
        label: "Capturas del sitio (inicio, pago, políticas)",
        rule: "BR-018",
        kind: "upload",
        status: "pending",
      },
      {
        id: "catalogo_productos",
        label: "Catálogo de productos / servicios",
        rule: "BR-018",
        kind: "upload",
        status: "pending",
      },
      {
        id: "materiales_mkt",
        label: "Materiales de mercadotecnia / publicidad",
        rule: "BR-018",
        kind: "upload",
        status: "pending",
      }
    );
  }

  // De-dupe (TNP for PF-sin-actividad already asks for buró in the base scenario).
  const seen = new Set<string>();
  return reqs.filter((r) => {
    const key = r.label;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Merge persisted "done" flags into a freshly built requirement list. */
export function applyDocumentProgress(
  reqs: Requirement[],
  done: Record<string, boolean>
): Requirement[] {
  return reqs.map((r) =>
    r.kind === "captured" || done[r.id] ? { ...r, status: "done" } : r
  );
}

export function requirementProgress(reqs: Requirement[]): number {
  if (reqs.length === 0) return 0;
  const done = reqs.filter((r) => r.status === "done").length;
  return Math.round((done / reqs.length) * 100);
}

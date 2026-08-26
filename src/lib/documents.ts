// Document definitions for the scan-first onboarding flow.
// Each document, once scanned, "extracts" data that pre-fills the confirm step
// (simulated OCR for the prototype).

import type { OnboardingData, PersonType } from "./types";

export type DocId =
  | "ine"
  | "comprobante"
  | "estado_cuenta"
  | "rfc_constancia"
  | "acta"
  | "poder";

export interface DocDef {
  id: DocId;
  title: string;
  desc: string;
  required: boolean;
  scope: "all" | "PM";
  icon: "id" | "home" | "bank" | "file" | "corporate";
  /** INE needs both sides. */
  twoSided?: boolean;
  optionalNote?: string;
}

export const DOCUMENTS: DocDef[] = [
  {
    id: "ine",
    title: "Identificación oficial (INE)",
    desc: "Frente y reverso de tu credencial vigente",
    required: true,
    scope: "all",
    icon: "id",
    twoSided: true,
  },
  {
    id: "comprobante",
    title: "Comprobante de domicilio",
    desc: "No mayor a 3 meses (recibo de luz, agua, etc.)",
    required: true,
    scope: "all",
    icon: "home",
  },
  {
    id: "estado_cuenta",
    title: "Estado de cuenta",
    desc: "Donde se abonarán tus ventas",
    required: true,
    scope: "all",
    icon: "bank",
  },
  {
    id: "rfc_constancia",
    title: "RFC / Constancia de Situación Fiscal",
    desc: "Acelera tu validación fiscal",
    required: false,
    scope: "all",
    icon: "file",
    optionalNote: "Opcional · puedes subirla después",
  },
  {
    id: "acta",
    title: "Acta constitutiva",
    desc: "Documento de constitución de la empresa",
    required: false,
    scope: "PM",
    icon: "corporate",
    optionalNote: "Opcional · se puede completar después",
  },
  {
    id: "poder",
    title: "Poder notarial",
    desc: "Del representante legal",
    required: false,
    scope: "PM",
    icon: "corporate",
    optionalNote: "Opcional · se puede completar después",
  },
];

export function documentsFor(personType: PersonType | null): DocDef[] {
  return DOCUMENTS.filter((d) => d.scope === "all" || d.scope === personType);
}

/**
 * Simulated OCR: what each document pre-fills when scanned. Returns a partial
 * of OnboardingData so the confirm step shows real, editable values.
 */
export function extractedData(
  docId: DocId,
  personType: PersonType | null
): Partial<OnboardingData> {
  switch (docId) {
    case "ine":
      return personType === "PM"
        ? { representanteLegal: "David Alejandro Gómez" }
        : { nombreCompleto: "Ana María Rodríguez López" };
    case "comprobante":
      return { domicilioFiscal: "Calle Primavera 22, Col. Del Valle, CDMX" };
    case "estado_cuenta":
      return {
        bank: "Banorte",
        clabe: "072180000012345678",
        accountHolder:
          personType === "PM"
            ? "Velpay Tecnologías S.A. de C.V."
            : "Ana María Rodríguez López",
      };
    case "rfc_constancia":
      return personType === "PM"
        ? {
            rfc: "VTE220412KJ9",
            razonSocial: "Velpay Tecnologías S.A. de C.V.",
            regimenFiscal: "601 - General de Ley Personas Morales",
          }
        : {
            rfc: "ROMA850312HN4",
            regimenFiscal:
              "612 - Personas Físicas con Actividades Empresariales y Profesionales",
          };
    default:
      return {};
  }
}

/** Required docs that gate the "Continuar" button on the documents step. */
export function requiredDocsDone(
  personType: PersonType | null,
  done: Record<string, boolean>
): boolean {
  return documentsFor(personType)
    .filter((d) => d.required)
    .every((d) => done[d.id]);
}

/** PM that skipped acta/poder — expediente proceeds but is flagged (soft-block). */
export function hasPendingCorporateDocs(data: OnboardingData): boolean {
  if (data.personType !== "PM") return false;
  return !data.documentsDone.acta || !data.documentsDone.poder;
}

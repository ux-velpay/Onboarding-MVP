// Document definitions for the scan-first onboarding flow.
// The system does NOT ask whether the merchant has an RFC — it extracts and
// validates the RFC from the uploaded documents (mainly the CSF). The user
// never types the RFC. The CSF is optional ("cuando aplique").

import type { OnboardingData } from "./types";

export type DocId =
  | "ine"
  | "comprobante"
  | "estado_cuenta"
  | "fotos_negocio"
  | "rfc_constancia" // CSF — Constancia de Situación Fiscal (optional)
  | "acta";

/** Documents requested at the start. Same base for everyone; PM adds the Acta. */
export function documentsFor(data: OnboardingData): DocDef[] {
  const isPM = data.personType === "PM";
  const docs: DocDef[] = [
    {
      id: "ine",
      title: isPM ? "INE del representante legal" : "Identificación oficial (INE)",
      desc: "Frente y reverso de la credencial vigente",
      required: true,
      icon: "id",
      twoSided: true,
    },
    {
      id: "comprobante",
      title: "Comprobante de domicilio",
      desc: "No mayor a 3 meses (recibo de luz, agua, etc.)",
      required: true,
      icon: "home",
    },
    {
      id: "estado_cuenta",
      title: "Estado de cuenta",
      desc: "Donde Banorte abonará tus ventas",
      required: true,
      icon: "bank",
    },
    {
      id: "fotos_negocio",
      title: "Fotos del negocio",
      desc: "Interior y exterior · mínimo 2 fotos",
      required: true,
      icon: "photo",
      twoSided: true,
      sides: ["Interior", "Exterior"],
      photos: true,
    },
    {
      id: "rfc_constancia",
      title: "Constancia de Situación Fiscal (CSF)",
      desc: isPM
        ? "Debe corresponder al negocio · de aquí extraemos y validamos tu RFC"
        : "Opcional · debe corresponder al negocio; de aquí extraemos tu RFC",
      required: isPM,
      icon: "file",
    },
  ];

  if (isPM) {
    docs.push({
      id: "acta",
      title: "Acta constitutiva",
      desc: "Documento de constitución de la empresa",
      required: true,
      icon: "corporate",
      uploadOnly: true,
    });
  }

  return docs;
}

export interface DocDef {
  id: DocId;
  title: string;
  desc: string;
  required: boolean;
  icon: "id" | "home" | "bank" | "file" | "corporate" | "photo";
  /** Two required captures (INE sides, or business interior/exterior photos). */
  twoSided?: boolean;
  sides?: [string, string];
  /** Photo capture ("Tomar foto") instead of document scan. */
  photos?: boolean;
  /** Only allow upload (no "Escanear"). */
  uploadOnly?: boolean;
}

/**
 * Simulated OCR: what each document extracts when scanned. The RFC and fiscal
 * data come from the CSF (BR-006 — used as validation, not a capture field).
 */
export function extractedData(
  docId: DocId,
  data: OnboardingData
): Partial<OnboardingData> {
  const isPM = data.personType === "PM";
  switch (docId) {
    case "ine":
      return isPM
        ? { nombres: "David Alejandro", apellidoPaterno: "Gómez", apellidoMaterno: "Ruiz" }
        : { nombres: "Ana María", apellidoPaterno: "Rodríguez", apellidoMaterno: "López" };
    case "comprobante":
      return { domicilioFiscal: "Calle Primavera 22, Col. Del Valle, CDMX" };
    case "estado_cuenta":
      return { bank: "Banorte", clabe: "072180000012345678" };
    case "rfc_constancia":
      return isPM
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

export function requiredDocsDone(data: OnboardingData): boolean {
  return documentsFor(data)
    .filter((d) => d.required)
    .every((d) => data.documentsDone[d.id]);
}

/** PM that skipped the Acta — proceeds but is flagged (soft-block). */
export function hasPendingCorporateDocs(data: OnboardingData): boolean {
  if (data.personType !== "PM") return false;
  return !data.documentsDone.acta;
}

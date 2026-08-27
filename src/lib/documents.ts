// Document definitions for the scan-first onboarding flow.
// Documents depend on the scenario (PF con RFC / PM con RFC / PF sin RFC).
// Once scanned, each document "extracts" data (simulated OCR) that feeds the
// cross-validation and confirm steps.

import type { OnboardingData } from "./types";

export type DocId =
  | "ine"
  | "comprobante"
  | "estado_cuenta"
  | "rfc_constancia" // CSF — Constancia de Situación Fiscal
  | "acta";

export type Scenario = "PF_RFC" | "PM_RFC" | "PF_SIN_RFC";

export function scenarioOf(data: OnboardingData): Scenario {
  if (data.personType === "PM") return "PM_RFC";
  if (data.hasRfc === false) return "PF_SIN_RFC";
  return "PF_RFC";
}

export interface DocDef {
  id: DocId;
  title: string;
  desc: string;
  required: boolean;
  icon: "id" | "home" | "bank" | "file" | "corporate";
  twoSided?: boolean;
}

/** Build the initial document list for the merchant's scenario (§5.1–5.3). */
export function documentsFor(data: OnboardingData): DocDef[] {
  const sc = scenarioOf(data);
  const docs: DocDef[] = [];

  // Identity — INE, or representative's INE (PM), or passport (PF sin RFC).
  if (sc === "PF_SIN_RFC") {
    docs.push({
      id: "ine",
      title: "Identificación tipo pasaporte",
      desc: "Pasaporte vigente (reemplaza al RFC, BR-019)",
      required: true,
      icon: "id",
    });
  } else {
    docs.push({
      id: "ine",
      title: sc === "PM_RFC" ? "INE del representante legal" : "Identificación oficial (INE)",
      desc: "Frente y reverso de la credencial vigente",
      required: true,
      icon: "id",
      twoSided: true,
    });
  }

  docs.push(
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
    }
  );

  // CSF — required for con-RFC scenarios; NOT requested for PF sin RFC.
  if (sc !== "PF_SIN_RFC") {
    docs.push({
      id: "rfc_constancia",
      title: "Constancia de Situación Fiscal (CSF)",
      desc: "Valida RFC, régimen fiscal y nombre",
      required: true,
      icon: "file",
    });
  }

  // Persona Moral — Acta Constitutiva, optional (can be uploaded in the Assistant).
  if (sc === "PM_RFC") {
    docs.push({
      id: "acta",
      title: "Acta constitutiva",
      desc: "Opcional · puedes subirla después en el Assistant",
      required: false,
      icon: "corporate",
    });
  }

  return docs;
}

/**
 * Simulated OCR: what each document pre-fills when scanned.
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

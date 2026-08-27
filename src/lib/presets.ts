// Dummy datasets for prototype review — scan-first flow. Documents are marked
// scanned and the extracted fields prefilled, so each preset lands on a
// ready-to-review expediente.

import type { OnboardingData } from "./types";

export interface Preset {
  id: string;
  label: string;
  data: Partial<OnboardingData>;
}

const SCANNED = {
  ine: true,
  ine_0: true,
  ine_1: true,
  comprobante: true,
  estado_cuenta: true,
  fotos_negocio: true,
  fotos_negocio_0: true,
  fotos_negocio_1: true,
};

export const PRESETS: Preset[] = [
  {
    id: "pf",
    label: "Persona Física (con CSF)",
    data: {
      personType: "PF",
      nombres: "Ana María",
      apellidoPaterno: "Rodríguez",
      apellidoMaterno: "López",
      rfc: "ROMA850312HN4",
      regimenFiscal:
        "612 - Personas Físicas con Actividades Empresariales y Profesionales",
      domicilioFiscal: "Calle Primavera 22, Col. Del Valle, CDMX",
      businessName: "Boutique Aurora",
      bank: "Banorte",
      clabe: "072180000012345678",
      accountHolder: "Ana María Rodríguez López",
      giroId: "5651",
      volumeRangeId: "r2",
      documentsDone: { ...SCANNED, rfc_constancia: true },
    },
  },
  {
    id: "pm",
    label: "Persona Moral",
    data: {
      personType: "PM",
      razonSocial: "Velpay Tecnologías S.A. de C.V.",
      nombres: "David Alejandro",
      apellidoPaterno: "Gómez",
      apellidoMaterno: "Ruiz",
      rfc: "VTE220412KJ9",
      regimenFiscal: "601 - General de Ley Personas Morales",
      domicilioFiscal: "Av. Reforma 405, Piso 12, CDMX",
      businessName: "Velpay Store",
      bank: "Banorte",
      clabe: "072180000087654321",
      accountHolder: "Velpay Tecnologías S.A. de C.V.",
      giroId: "8999",
      volumeRangeId: "r2",
      documentsDone: { ...SCANNED, rfc_constancia: true, acta: true },
    },
  },
  {
    id: "discrepancia",
    label: "Discrepancia entre documentos",
    data: {
      personType: "PF",
      // OCR found conflicting data across documents -> cross-validation appears.
      simulateDiscrepancy: true,
      nombres: "Ana María",
      apellidoPaterno: "Rodríguez",
      apellidoMaterno: "López",
      rfc: "ROMA850312HN4",
      regimenFiscal:
        "612 - Personas Físicas con Actividades Empresariales y Profesionales",
      domicilioFiscal: "Calle Primavera 22, Col. Del Valle, CDMX",
      businessName: "Boutique Aurora",
      bank: "Banorte",
      clabe: "072180000012345678",
      accountHolder: "Ana M. Rodríguez L.",
      giroId: "5651",
      volumeRangeId: "r2",
      documentsDone: { ...SCANNED, rfc_constancia: true },
    },
  },
  {
    id: "giroprohibido",
    label: "Giro en revisión (Mesa de Control)",
    data: {
      personType: "PF",
      nombres: "Laura",
      apellidoPaterno: "Méndez",
      apellidoMaterno: "Soto",
      rfc: "MESL900101AB1",
      regimenFiscal:
        "612 - Personas Físicas con Actividades Empresariales y Profesionales",
      domicilioFiscal: "Calle Roble 8, Col. Centro, CDMX",
      businessName: "Estrella Nocturna",
      bank: "Banorte",
      clabe: "072180000099998888",
      accountHolder: "Laura Méndez Soto",
      // Prohibited giro → handled internally (held for Mesa de Control).
      giroId: "7995",
      volumeRangeId: "r2",
      documentsDone: { ...SCANNED, rfc_constancia: true },
    },
  },
  {
    id: "sinrfc",
    label: "Sin CSF (RFC no extraído)",
    data: {
      personType: "PF",
      nombres: "Juan",
      apellidoPaterno: "Pérez",
      apellidoMaterno: "Hernández",
      domicilioFiscal: "Mercado Local 5, Col. Centro, CDMX",
      businessName: "Tacos El Güero",
      bank: "Banorte",
      clabe: "072180000011112222",
      accountHolder: "Juan Pérez Hernández",
      giroId: "5812",
      volumeRangeId: "r1",
      documentsDone: { ...SCANNED },
    },
  },
];

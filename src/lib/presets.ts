// Dummy datasets for prototype review — scan-first flow with split names,
// giro/MCC on the confirm step, and volume on the business step.

import type { OnboardingData } from "./types";

export interface Preset {
  id: string;
  label: string;
  data: Partial<OnboardingData>;
}

const SCANNED = {
  ine: true,
  ine_frente: true,
  ine_reverso: true,
  comprobante: true,
  estado_cuenta: true,
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
      bank: "Banorte",
      clabe: "072180000012345678",
      giroId: "5651",
      mcc: "5651 - Tiendas de ropa",
      volumeRangeId: "r2",
      documentsDone: { ...SCANNED, rfc_constancia: true },
    },
  },
  {
    id: "pm",
    label: "Persona Moral (sin acta)",
    data: {
      personType: "PM",
      razonSocial: "Velpay Tecnologías S.A. de C.V.",
      nombres: "David Alejandro",
      apellidoPaterno: "Gómez",
      apellidoMaterno: "Ruiz",
      rfc: "VTE220412KJ9",
      regimenFiscal: "601 - General de Ley Personas Morales",
      domicilioFiscal: "Av. Reforma 405, Piso 12, CDMX",
      bank: "Banorte",
      clabe: "072180000087654321",
      giroId: "8999",
      mcc: "8999 - Servicios profesionales",
      volumeRangeId: "r3",
      documentsDone: { ...SCANNED, rfc_constancia: true },
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
      bank: "Banorte",
      clabe: "072180000012345678",
      giroId: "5651",
      mcc: "5651 - Tiendas de ropa",
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
      bank: "Banorte",
      clabe: "072180000099998888",
      // Prohibited giro → handled internally (held for Mesa de Control).
      giroId: "7995",
      mcc: "5399 - Comercio general",
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
      bank: "Banorte",
      clabe: "072180000011112222",
      giroId: "5812",
      mcc: "5812 - Restaurantes",
      volumeRangeId: "r1",
      documentsDone: { ...SCANNED },
    },
  },
];

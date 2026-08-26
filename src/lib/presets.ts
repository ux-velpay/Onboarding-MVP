// Dummy datasets for prototype review — updated for the scan-first flow.
// Documents are marked as already "scanned" (documentsDone) and the extracted
// fields are prefilled, so each preset lands on a ready-to-review expediente.

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
    label: "Persona Física",
    data: {
      personType: "PF",
      nombreCompleto: "Ana María Rodríguez López",
      rfc: "ROMA850312HN4",
      regimenFiscal:
        "612 - Personas Físicas con Actividades Empresariales y Profesionales",
      domicilioFiscal: "Calle Primavera 22, Col. Del Valle, CDMX",
      businessName: "Boutique Aurora",
      email: "contacto@boutiqueaurora.mx",
      phone: "55 1234 5678",
      bank: "Banorte",
      clabe: "072180000012345678",
      accountHolder: "Ana María Rodríguez López",
      activityId: "ropa",
      giroId: "5651",
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
      rfc: "VTE220412KJ9",
      regimenFiscal: "601 - General de Ley Personas Morales",
      representanteLegal: "David Alejandro Gómez",
      domicilioFiscal: "Av. Reforma 405, Piso 12, CDMX",
      businessName: "Velpay Store",
      email: "ventas@velpaystore.mx",
      phone: "55 8765 4321",
      bank: "Banorte",
      clabe: "072180000087654321",
      accountHolder: "Velpay Tecnologías S.A. de C.V.",
      activityId: "servicios",
      giroId: "8999",
      volumeRangeId: "r3",
      // acta/poder intentionally NOT scanned → shows the pending-docs notice.
      documentsDone: { ...SCANNED, rfc_constancia: true },
    },
  },
  {
    id: "sinrfc",
    label: "Sin RFC (constancia después)",
    data: {
      personType: "PF",
      nombreCompleto: "Juan Pérez Hernández",
      domicilioFiscal: "Mercado Local 5, Col. Centro, CDMX",
      businessName: "Tacos El Güero",
      email: "elguero@gmail.com",
      phone: "55 2222 3333",
      bank: "Banorte",
      clabe: "072180000011112222",
      accountHolder: "Juan Pérez Hernández",
      activityId: "restaurant",
      giroId: "5812",
      volumeRangeId: "r1",
      // rfc_constancia is optional and left unscanned.
      documentsDone: { ...SCANNED },
    },
  },
];

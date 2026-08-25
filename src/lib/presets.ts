// Dummy datasets for prototype review. Each preset is a coherent, complete
// merchant profile that exercises a different branch of the rules engine.

import type { OnboardingData } from "./types";

export interface Preset {
  id: string;
  label: string;
  data: Partial<OnboardingData>;
}

export const PRESETS: Preset[] = [
  {
    id: "pf-con-actividad",
    label: "PF con actividad · TP",
    data: {
      personType: "PF",
      hasRfc: true,
      doesBusinessActivity: true,
      rfc: "ROMA850312HN4",
      nombreCompleto: "Ana María Rodríguez López",
      regimenFiscal:
        "612 - Personas Físicas con Actividades Empresariales y Profesionales",
      domicilioFiscal: "Calle Primavera 22, Col. Del Valle, CDMX",
      businessName: "Boutique Aurora",
      email: "contacto@boutiqueaurora.mx",
      phone: "55 1234 5678",
      address: "Av. Insurgentes Sur 1234, CDMX",
      bank: "Banorte",
      clabe: "072180000012345678",
      accountHolder: "Ana María Rodríguez López",
      activityId: "ropa",
      giroId: "5651",
      volumeRangeId: "r2",
      channel: "TP",
      documentsDone: {},
    },
  },
  {
    id: "persona-moral",
    label: "Persona Moral · TNP",
    data: {
      personType: "PM",
      hasRfc: true,
      doesBusinessActivity: null,
      rfc: "VTE220412KJ9",
      razonSocial: "Velpay Tecnologías S.A. de C.V.",
      regimenFiscal: "601 - General de Ley Personas Morales",
      domicilioFiscal: "Av. Reforma 405, Piso 12, CDMX",
      representanteLegal: "David Alejandro Gómez",
      businessName: "Velpay Store",
      email: "ventas@velpaystore.mx",
      phone: "55 8765 4321",
      address: "Av. Reforma 405, Piso 12, CDMX",
      bank: "Banorte",
      clabe: "072180000087654321",
      accountHolder: "Velpay Tecnologías S.A. de C.V.",
      activityId: "servicios",
      giroId: "8999",
      volumeRangeId: "r3",
      channel: "TNP",
      tnp: {
        url: "https://velpaystore.mx",
        products: "Ropa de diseño, calzado y accesorios de moda",
        description:
          "Fabricamos y distribuimos prendas confeccionadas a mano en México.",
        policies: "Devolución dentro de 15 días",
        paymentFlow: "Pago en línea con tarjeta, transferencia y PayPal",
      },
      documentsDone: {},
    },
  },
  {
    id: "sin-rfc",
    label: "Sin RFC · giro 5399",
    data: {
      personType: "PF",
      hasRfc: false,
      doesBusinessActivity: true,
      nombreCompleto: "Juan Pérez Hernández",
      domicilioFiscal: "Mercado Local 5, Col. Centro, CDMX",
      businessName: "Tacos El Güero",
      email: "elguero@gmail.com",
      phone: "55 2222 3333",
      address: "Mercado Local 5, Col. Centro, CDMX",
      bank: "Banorte",
      clabe: "072180000011112222",
      accountHolder: "Juan Pérez Hernández",
      activityId: "restaurant",
      giroId: "5812",
      volumeRangeId: "r1",
      channel: "TP",
      documentsDone: {},
    },
  },
];

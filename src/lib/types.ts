// Domain model for the VelPay Nivel 0 onboarding (Banorte, Tasa Agregador).
// Mirrors the PRD 26034-VEL-ONB (MVP).

export type PersonType = "PF" | "PM";
export type Channel = "TP" | "TNP";

/** Business scenarios from PRD §D4. A merchant always falls into exactly one. */
export type Scenario =
  | "PF_SIN_ACTIVIDAD" // Escenario 1
  | "PF_CON_ACTIVIDAD" // Escenario 2
  | "PM" // Escenario 3
  | "SIN_RFC"; // Escenario 4 (overlay when hasRfc === false)

/** Expediente lifecycle states — PRD §B4. */
export type ExpedienteState =
  | "BORRADOR"
  | "INCOMPLETO"
  | "EN_VALIDACION"
  | "EXPEDIENTE_COMPLETO"
  | "ENVIADO_BANORTE"
  | "EN_REVISION_BANORTE"
  | "INFORMACION_ADICIONAL"
  | "APROBADO"
  | "RECHAZADO"
  | "ACTIVABLE"
  | "ACTIVO";

/** Level classification — PRD BR-001 / BR-002. */
export type Level = "NIVEL_0" | "FUERA_DE_RANGO";

export interface VolumeRange {
  id: string;
  label: string;
  min: number;
  max: number | null;
  /** true when this range exceeds the $8,000 Nivel 0 ceiling (BR-002). */
  exceedsNivel0: boolean;
}

export interface Activity {
  id: string;
  label: string;
  description: string;
  icon: "restaurant" | "shop" | "briefcase";
  giroId: string;
}

export interface Giro {
  id: string;
  label: string;
  mcc: string;
  /** BR-020 — prohibited or high-risk per Manual Giros de Riesgo Velpay. */
  blocked?: boolean;
  blockedReason?: string;
}

/** A requirement produced by the rules engine (BR-003 / BR-004). */
export interface Requirement {
  id: string;
  label: string;
  hint?: string;
  /** The business rule that generated this requirement (BR-004: traceability). */
  rule: string;
  kind: "captured" | "upload";
  status: "pending" | "done";
}

export type RfcCheck =
  | { status: "valid" }
  | { status: "inconsistent" }
  | { status: "missing" };

export interface OnboardingData {
  // Step 1 — person type
  personType: PersonType | null;
  hasRfc: boolean | null;
  doesBusinessActivity: boolean | null; // PF only

  // Step 2 — tax data
  rfc: string;
  razonSocial: string;
  nombreCompleto: string;
  regimenFiscal: string;
  domicilioFiscal: string;
  representanteLegal: string;

  // Step 3 — business data
  businessName: string;
  email: string;
  phone: string;
  address: string;

  // Step 4 — bank data
  bank: string;
  clabe: string;
  accountHolder: string;

  // Step 5 — activity / giro
  activityId: string | null;
  giroId: string | null;

  // Step 6 — volume
  volumeRangeId: string | null;

  // Step 7 — channel
  channel: Channel | null;

  // TNP extra info
  tnp: {
    url: string;
    products: string;
    description: string;
    policies: string;
    paymentFlow: string;
  };

  // Documents (requirement id -> done)
  documentsDone: Record<string, boolean>;
}

export function emptyOnboardingData(): OnboardingData {
  return {
    personType: null,
    hasRfc: null,
    doesBusinessActivity: null,
    rfc: "",
    razonSocial: "",
    nombreCompleto: "",
    regimenFiscal: "",
    domicilioFiscal: "",
    representanteLegal: "",
    businessName: "",
    email: "",
    phone: "",
    address: "",
    bank: "",
    clabe: "",
    accountHolder: "",
    activityId: null,
    giroId: null,
    volumeRangeId: null,
    channel: null,
    tnp: { url: "", products: "", description: "", policies: "", paymentFlow: "" },
    documentsDone: {},
  };
}

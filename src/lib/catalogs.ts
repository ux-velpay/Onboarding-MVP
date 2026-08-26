// Controlled catalogs — PRD BR-009 (activity → giro → MCC) and BR-020
// (giros prohibidos / de alto riesgo del Manual Giros de Riesgo Velpay).
// Giro and activity are NEVER free text; they come from these catalogs.

import type { Activity, Giro, VolumeRange } from "./types";

/** Volume ranges — PRD BR-001 / BR-002. The last one crosses the $8,000 ceiling. */
export const VOLUME_RANGES: VolumeRange[] = [
  { id: "r1", label: "Menos de $2,000", min: 1, max: 2000, exceedsNivel0: false },
  { id: "r2", label: "$2,001 - $5,000", min: 2001, max: 5000, exceedsNivel0: false },
  { id: "r3", label: "$5,001 - $8,000", min: 5001, max: 8000, exceedsNivel0: false },
  { id: "r4", label: "Más de $8,000", min: 8001, max: null, exceedsNivel0: true },
];

/** MCC catalog (Merchant Category Codes) — BR-009. */
export const MCC_CATALOG = [
  "5812 - Restaurantes",
  "5651 - Tiendas de ropa",
  "8999 - Servicios profesionales",
  "5411 - Abarrotes y minisúper",
  "5941 - Artículos deportivos",
  "5399 - Comercio general",
];

/** Régimen fiscal SAT (subset relevant to Nivel 0). */
export const REGIMENES_FISCALES = [
  "601 - General de Ley Personas Morales",
  "603 - Personas Morales con Fines no Lucrativos",
  "605 - Sueldos y Salarios e Ingresos Asimilados a Salarios",
  "612 - Personas Físicas con Actividades Empresariales y Profesionales",
  "621 - Incorporación Fiscal",
  "626 - Régimen Simplificado de Confianza (RESICO)",
];

export const POLITICAS_DEVOLUCION = [
  "Política estándar de 30 días",
  "Devolución dentro de 15 días",
  "Solo cambios, sin reembolso",
  "Sin devoluciones (bienes perecederos)",
  "Política personalizada",
];

/**
 * Giro catalog. A handful are flagged `blocked` per BR-020 (A2.2). The catalog
 * excludes prohibited giros by design; these blocked entries exist so the demo
 * can show the rejection path (giro seleccionado → bloqueo inmediato).
 */
export const GIROS: Giro[] = [
  { id: "5812", label: "Restaurante", mcc: "5812" },
  { id: "5651", label: "Tienda de ropa", mcc: "5651" },
  { id: "8999", label: "Servicios profesionales", mcc: "8999" },
  { id: "5399", label: "Comercio general (Sub-afiliado sin RFC)", mcc: "5399" },
  { id: "5411", label: "Abarrotes y minisúper", mcc: "5411" },
  { id: "5941", label: "Artículos deportivos", mcc: "5941" },
  {
    id: "7995",
    label: "Casino / Casa de apuestas",
    mcc: "7995",
    blocked: true,
    blockedReason:
      "La actividad seleccionada no está disponible para este tipo de servicio.",
  },
  {
    id: "7273",
    label: "Entretenimiento para adultos",
    mcc: "7273",
    blocked: true,
    blockedReason:
      "La actividad seleccionada no está disponible para este tipo de servicio.",
  },
];

/** Suggested activities shown on the "¿A qué se dedica tu negocio?" step. */
export const ACTIVITIES: Activity[] = [
  {
    id: "restaurant",
    label: "Restaurante",
    description: "Venta de alimentos y bebidas preparados",
    icon: "restaurant",
    giroId: "5812",
  },
  {
    id: "ropa",
    label: "Tienda de ropa",
    description: "Venta minorista de prendas de vestir y accesorios",
    icon: "shop",
    giroId: "5651",
  },
  {
    id: "servicios",
    label: "Servicios profesionales",
    description: "Consultoría, servicios médicos, legales, etc.",
    icon: "briefcase",
    giroId: "8999",
  },
];

/** Activities offered when the merchant searches — includes a blocked one. */
export const ALL_ACTIVITIES: Activity[] = [
  ...ACTIVITIES,
  {
    id: "abarrotes",
    label: "Abarrotes y minisúper",
    description: "Venta de productos de consumo básico",
    icon: "shop",
    giroId: "5411",
  },
  {
    id: "deportes",
    label: "Artículos deportivos",
    description: "Venta de ropa y equipo deportivo",
    icon: "shop",
    giroId: "5941",
  },
  {
    id: "apuestas",
    label: "Casa de apuestas",
    description: "Juegos de azar y apuestas",
    icon: "briefcase",
    giroId: "7995",
  },
];

export function getGiro(id: string | null | undefined): Giro | undefined {
  if (!id) return undefined;
  return GIROS.find((g) => g.id === id);
}

export function getActivity(id: string | null | undefined): Activity | undefined {
  if (!id) return undefined;
  return ALL_ACTIVITIES.find((a) => a.id === id);
}

export function getVolumeRange(id: string | null | undefined): VolumeRange | undefined {
  if (!id) return undefined;
  return VOLUME_RANGES.find((r) => r.id === id);
}

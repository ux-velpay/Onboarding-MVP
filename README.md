# VelPay · Portal de Onboarding (Nivel 0 · Banorte)

Implementación del **MVP del Portal de Onboarding Escalonado** de VelPay, Nivel 0 /
Banorte / esquema Tasa Agregador. Traduce a código el flujo diseñado en Figma y las
reglas de negocio del PRD hijo `26034-VEL-ONB`.

Rango operativo: comercios con volumen esperado de **$1 a $8,000 MXN mensuales**,
Persona Física y Persona Moral, canales **TP** (terminal física) y **TNP** (en línea),
incluyendo la ruta de alta **sin RFC** (Sub-afiliado, giro 5399 · Anexo B).

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** con los design tokens de VelPay como CSS variables
- Tipografía **Work Sans** (`next/font`)
- 100% estático — despliega en **Vercel** sin configuración

## Arranque

```bash
npm install
npm run dev
```

Abre <http://localhost:3000>. El botón flotante **"Pantallas"** (esquina inferior
derecha) es un navegador de revisión de diseño para saltar a cualquiera de las 20
pantallas sin recorrer todo el flujo. Es solo de prototipo.

## Estructura

```
src/
├─ app/                      Rutas Next.js (raíz = wizard) + globals.css (tokens)
├─ lib/
│  ├─ types.ts               Modelo de dominio (escenarios, estados, requisitos)
│  ├─ catalogs.ts            Catálogos controlados: giros/MCC, actividades, volumen,
│  │                         régimen fiscal, giros prohibidos (BR-009 / BR-020)
│  ├─ rules-engine.ts        ★ Motor de reglas Banorte (BR-001 … BR-020)
│  └─ flow.ts                Grafo de navegación / ramificación del wizard
└─ components/
   ├─ ui/                    Primitivas del design system (Button, TextField, RadioCard…)
   └─ onboarding/
      ├─ provider.tsx        Estado del wizard + persistencia en localStorage (CA-12)
      ├─ SplitLayout / …     Layouts (wizard partido + card centrada)
      └─ steps/              Una pantalla por paso
```

## El motor de reglas (`src/lib/rules-engine.ts`)

Es el corazón del MVP. A partir del perfil del comercio determina escenario, nivel,
validación de giro y la **lista dinámica de requisitos** — cada uno guarda el `BR` que
lo originó (BR-004, trazabilidad).

| Función | Reglas del PRD |
|---|---|
| `classifyLevel` | BR-001 / BR-002 — Nivel 0 vs. redirección > $8,000 |
| `resolveScenario` | §D4 — escenarios 1-4 (PF sin/con actividad, PM, sin RFC) |
| `validateRfc` | BR-006 / BR-007 / BR-008 — RFC válido / inconsistente / ausente |
| `isGiroBlocked` | BR-020 — bloqueo de giros prohibidos o de alto riesgo |
| `buildRequirements` | BR-017 / BR-018 / BR-019 / BR-010 — checklist condicionado |

Ramas verificadas del flujo: `sin RFC → giro 5399 / Anexo B`, `giro prohibido → estado
bloqueado`, `volumen > $8,000 → redirección al Assistant`, `TNP → requisitos de sitio
web`, y el checklist que cambia según escenario y canal.

## Fuera de alcance (MVP)

- **Backoffice** de la Mesa de Control (no está en el Figma; siguiente fase).
- Backend real / envío a Banorte: las validaciones y el motor de reglas corren en el
  cliente; la carga de documentos y las resoluciones de Banorte están simuladas.
- Niveles 1-3 y otros adquirentes (el modelo de datos ya los contempla, la experiencia
  del MVP no).

## Referencias

- PRD hijo: `26034-VEL-ONB — MVP Portal de Onboarding Nivel 0`
- Figma: Screenflow "Onboarding Velpay" (Q3 Jul–Sept '26)
- Design tokens: `velpay-design-system / Foundations`

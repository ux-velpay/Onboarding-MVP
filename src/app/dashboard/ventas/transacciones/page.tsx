"use client";
import { useState } from "react";
import type { SVGProps } from "react";
import { cn } from "@/lib/cn";

// ── Icons ─────────────────────────────────────────────────────────
const S = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const IcoDownload = (p: SVGProps<SVGSVGElement>) => <svg width={16} height={16} viewBox="0 0 24 24" {...S} {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const IcoSearch   = (p: SVGProps<SVGSVGElement>) => <svg width={15} height={15} viewBox="0 0 24 24" {...S} {...p}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const IcoChevDown = (p: SVGProps<SVGSVGElement>) => <svg width={14} height={14} viewBox="0 0 24 24" {...S} {...p}><path d="m6 9 6 6 6-6"/></svg>;
const IcoCalendar = (p: SVGProps<SVGSVGElement>) => <svg width={14} height={14} viewBox="0 0 24 24" {...S} {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IcoFilter   = (p: SVGProps<SVGSVGElement>) => <svg width={14} height={14} viewBox="0 0 24 24" {...S} {...p}><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>;

// ── Types & mock data ─────────────────────────────────────────────
type Estatus = "Rechazada" | "Aprobada" | "Pendiente";

type Tx = {
  id: number;
  sucursal: string;
  tipo: string;
  estatus: Estatus;
  cajero: string;
  fecha: string;
  brand: "VISA" | "MC" | "AMEX";
  last4: string;
  tipoTarjeta: string;
  tipoAuth: string;
  monto: string;
};

const MOCK: Tx[] = [
  { id: 1, sucursal: "EDARVA 2 ECOMMERCE", tipo: "Venta", estatus: "Rechazada", cajero: "edarva2", fecha: "27/08/2026 00:00:00", brand: "VISA", last4: "2948", tipoTarjeta: "Débito",  tipoAuth: "Sin firma", monto: "$1.00" },
  { id: 2, sucursal: "EDARVA 2 ECOMMERCE", tipo: "Venta", estatus: "Rechazada", cajero: "edarva2", fecha: "27/07/2026 00:00:01", brand: "VISA", last4: "2948", tipoTarjeta: "Débito",  tipoAuth: "Sin firma", monto: "$1.00" },
  { id: 3, sucursal: "EDARVA 2 ECOMMERCE", tipo: "Venta", estatus: "Rechazada", cajero: "edarva2", fecha: "27/06/2026 00:00:01", brand: "VISA", last4: "2948", tipoTarjeta: "Débito",  tipoAuth: "Sin firma", monto: "$1.00" },
];

// ── Sub-components ────────────────────────────────────────────────
const STATUS_CFG: Record<Estatus, { bg: string; dot: string; text: string }> = {
  Rechazada: { bg: "bg-red-50",      dot: "bg-red-400",    text: "text-red-500"   },
  Aprobada:  { bg: "bg-success-bg",  dot: "bg-success",    text: "text-success"   },
  Pendiente: { bg: "bg-warning-bg",  dot: "bg-warning",    text: "text-warning"   },
};

function StatusBadge({ status }: { status: Estatus }) {
  const cfg = STATUS_CFG[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium whitespace-nowrap", cfg.bg, cfg.text)}>
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", cfg.dot)} />
      {status}
    </span>
  );
}

const BRAND_CFG = {
  VISA: { bg: "bg-blue-600",   label: "VISA" },
  MC:   { bg: "bg-red-500",    label: "MC"   },
  AMEX: { bg: "bg-blue-400",   label: "AMEX" },
};

function CardBadge({ brand, last4 }: { brand: Tx["brand"]; last4: string }) {
  const cfg = BRAND_CFG[brand];
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
      <span className={cn("inline-flex items-center justify-center text-[9px] font-black text-white rounded px-1 py-0.5 leading-none tracking-wide", cfg.bg)}>
        {cfg.label}
      </span>
      <span className="text-[13px] text-ink-3">**** {last4}</span>
    </span>
  );
}

// ── Page ──────────────────────────────────────────────────────────
export default function TransaccionesPage() {
  const [search, setSearch] = useState("");

  const filtered = MOCK.filter(tx =>
    search === "" ||
    tx.sucursal.toLowerCase().includes(search.toLowerCase()) ||
    tx.cajero.toLowerCase().includes(search.toLowerCase()) ||
    tx.last4.includes(search)
  );

  return (
    <div className="p-4 md:p-6 space-y-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-[20px] md:text-[22px] font-bold text-primary-dark">
          Ventas/<span className="text-primary"> Transacciones</span>
        </h1>
        <button className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-primary-dark text-white text-[13px] font-semibold hover:bg-primary-hover transition-colors shadow-[0_1px_2px_rgba(45,0,109,0.3)] shrink-0">
          <IcoDownload />
          <span className="hidden sm:inline">Descargar</span>
        </button>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col gap-3">
        {/* Search — full width */}
        <div className="relative">
          <IcoSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Busca por sucursal, correo o teléfono"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-line-strong bg-white text-[13px] text-ink placeholder:text-placeholder focus:outline-none focus:border-primary focus:ring-2 focus:ring-[rgba(117,75,241,0.2)] transition"
          />
        </div>

        {/* Filter buttons — always single row, shrink text on mobile */}
        <div className="flex items-center gap-2">
          <button className="inline-flex flex-1 sm:flex-none items-center justify-center gap-1.5 h-10 px-3 rounded-xl border border-line-strong bg-white text-[13px] text-ink-2 hover:bg-surface transition-colors whitespace-nowrap min-w-0">
            <span className="truncate">Sucursales</span>
            <IcoChevDown className="text-ink-3 shrink-0" />
          </button>
          <button className="inline-flex flex-1 sm:flex-none items-center justify-center gap-1.5 h-10 px-3 rounded-xl border border-line-strong bg-white text-[13px] text-ink-2 hover:bg-surface transition-colors whitespace-nowrap min-w-0">
            <IcoCalendar className="text-ink-3 shrink-0" />
            <span className="truncate">17/06/26 – 20/09/26</span>
          </button>
          <button className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl border border-line-strong bg-white text-[13px] text-ink-2 hover:bg-surface transition-colors shrink-0">
            <IcoFilter className="text-ink-3" />
            Filtros
          </button>
        </div>
      </div>

      {/* ── Table — always table (scroll on mobile) ── */}
      <div className="bg-white rounded-xl overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-line">
                {[
                  "Sucursal", "Tipo de Movimiento", "Estatus", "Cajero",
                  "Fecha de transacción", "Tarjeta", "Tipo", "Tipo de Auth", "Monto total",
                ].map((h, i) => (
                  <th key={i} className={cn(
                    "py-4 text-[12px] font-semibold text-ink-2 whitespace-nowrap text-left",
                    i === 0 ? "pl-6 pr-4" : i === 8 ? "pl-4 pr-6" : "px-4"
                  )}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map(tx => (
                <tr key={tx.id} className="hover:bg-surface/50 transition-colors">
                  <td className="pl-6 pr-4 py-4 text-[13px] text-ink whitespace-nowrap">{tx.sucursal}</td>
                  <td className="px-4 py-4 text-[13px] text-ink">{tx.tipo}</td>
                  <td className="px-4 py-4"><StatusBadge status={tx.estatus} /></td>
                  <td className="px-4 py-4 text-[13px] text-ink">{tx.cajero}</td>
                  <td className="px-4 py-4 text-[13px] text-ink-2 whitespace-nowrap">{tx.fecha}</td>
                  <td className="px-4 py-4"><CardBadge brand={tx.brand} last4={tx.last4} /></td>
                  <td className="px-4 py-4 text-[13px] text-ink">{tx.tipoTarjeta}</td>
                  <td className="px-4 py-4 text-[13px] text-ink">{tx.tipoAuth}</td>
                  <td className="pl-4 pr-6 py-4 text-[13px] font-medium text-ink">{tx.monto}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-14 text-center text-sm text-ink-3">
                    Sin resultados para "{search}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

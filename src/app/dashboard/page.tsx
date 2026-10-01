"use client";
import { useState } from "react";
import type { SVGProps } from "react";
import { cn } from "@/lib/cn";

// ── Micro icons ───────────────────────────────────────────────────
const S = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const ChevDown  = (p: SVGProps<SVGSVGElement>) => <svg width={16} height={16} viewBox="0 0 24 24" {...S} {...p}><path d="m6 9 6 6 6-6"/></svg>;
const HelpCirc  = (p: SVGProps<SVGSVGElement>) => <svg width={13} height={13} viewBox="0 0 24 24" {...S} {...p}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/></svg>;

// ── TP / TNP toggle ───────────────────────────────────────────────
function Toggle({
  value,
  onChange,
}: {
  value: "TP" | "TNP";
  onChange: (v: "TP" | "TNP") => void;
}) {
  return (
    <div className="flex rounded-lg border border-line overflow-hidden text-xs font-semibold shrink-0">
      {(["TP", "TNP"] as const).map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            "px-3 py-1.5 transition-colors",
            value === opt
              ? "bg-white text-ink shadow-sm"
              : "bg-surface text-ink-3 hover:text-ink-2"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// ── Simple bar chart (SVG) ────────────────────────────────────────
const Y_LABELS = ["$0.00", "$0.20", "$0.40", "$0.60", "$0.80", "$1.00"];

function BarChart({
  labels,
  data,
  maxValue = 1,
}: {
  labels: string[];
  data: number[];
  maxValue?: number;
}) {
  const W = 380;
  const H = 160;
  const padL = 44;
  const padB = 26;
  const padT = 10;
  const padR = 8;
  const innerH = H - padT - padB;
  const innerW = W - padL - padR;
  const colW = innerW / labels.length;
  const barW = Math.min(22, colW * 0.45);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      aria-hidden="true"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {/* Y gridlines + labels */}
      {Y_LABELS.map((lbl, i) => {
        const ratio = i / (Y_LABELS.length - 1);
        const y = padT + innerH - ratio * innerH;
        return (
          <g key={i}>
            <line x1={padL} x2={W - padR} y1={y} y2={y} stroke="#e5e7eb" strokeWidth={1} />
            <text x={padL - 5} y={y + 3.5} textAnchor="end" fontSize={9} fill="#9aa1ac">
              {lbl}
            </text>
          </g>
        );
      })}

      {/* Bars + X labels */}
      {labels.map((lbl, i) => {
        const val = data[i] ?? 0;
        const ratio = maxValue > 0 ? val / maxValue : 0;
        const barH = Math.max(2, ratio * innerH);
        const cx = padL + (i + 0.5) * colW;
        const barX = cx - barW / 2;
        const barY = padT + innerH - barH;

        return (
          <g key={i}>
            <rect x={barX} y={barY} width={barW} height={barH} fill="#754bf1" rx={3} />
            <text x={cx} y={H - 5} textAnchor="middle" fontSize={10} fill="#6b7280">
              {lbl}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Color dot ─────────────────────────────────────────────────────
function ColorDot({ color }: { color: string }) {
  return (
    <span
      className="inline-block w-3 h-3 rounded-sm shrink-0"
      style={{ background: color }}
    />
  );
}

// ── Dashboard page ────────────────────────────────────────────────
const PAYMENT_TYPES = [
  { label: "Débito",          color: "#2d006d" },
  { label: "Crédito",         color: "#754bf1" },
  { label: "Internacional",   color: "#b5a4f0" },
  { label: "AMEX",            color: "#9179ea" },
  { label: "Vales",           color: "#d1c7f6" },
];

const SALES_BREAKDOWN = [
  { label: "Tarjeta presente",       help: true  },
  { label: "Tarjeta no presente",    help: true  },
  { label: "Transferencia electrónica" },
  { label: "Ventas manuales",        badge: "Efectivo" },
];

export default function DashboardPage() {
  const [cardToggle, setCardToggle] = useState<"TP" | "TNP">("TP");
  const [msiToggle,  setMsiToggle]  = useState<"TP" | "TNP">("TP");

  const zeroSales = [0, 0, 0, 0];
  const zeroMsi   = [0, 0, 0, 0, 0, 0];

  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-[22px] font-bold text-primary-dark leading-tight">
          Dashboard de ventas del día
        </h1>

        <button className="inline-flex items-center gap-2 self-start sm:self-auto px-4 py-2 bg-white border border-line-strong rounded-xl text-sm text-ink-2 hover:bg-surface transition-colors">
          Todas las sucursales
          <ChevDown className="text-ink-3" />
        </button>
      </div>

      {/* ── Cards grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-4 md:gap-5 items-start">

        {/* ── Left: Total en ventas ── */}
        <div className="bg-white rounded-xl p-5 space-y-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <div>
            <p className="text-sm text-ink-3">
              Total en ventas <em>(Menos Devoluciones)</em>
            </p>
            <p className="text-[28px] font-semibold text-ink mt-1 leading-none">$0.00</p>
          </div>

          <BarChart labels={["TP", "TNP", "STP", "VM"]} data={zeroSales} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 pt-1 border-t border-line">
            {SALES_BREAKDOWN.map((item) => (
              <div key={item.label}>
                <div className="flex items-center gap-1.5 text-[13px] text-ink-3">
                  <ColorDot color="#754bf1" />
                  <span className="flex-1 leading-tight">{item.label}</span>
                  {item.help && <HelpCirc className="text-ink-3 shrink-0" />}
                  {item.badge && (
                    <span className="text-[10px] font-semibold bg-success-bg text-success px-1.5 py-0.5 rounded-md leading-none">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-[18px] font-semibold text-ink mt-1 pl-[18px]">$0.00</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="flex flex-col gap-4 md:gap-5">

          {/* Ventas por tipo tarjeta */}
          <div className="bg-white rounded-xl p-5" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-ink-3">Ventas por tipo tarjeta</p>
                <p className="text-[24px] font-semibold text-ink mt-0.5 leading-none">$0.00</p>
              </div>
              <Toggle value={cardToggle} onChange={setCardToggle} />
            </div>

            <div className="mt-5 space-y-3">
              {PAYMENT_TYPES.map((pt) => (
                <div key={pt.label} className="flex items-center gap-2.5">
                  <ColorDot color={pt.color} />
                  <span className="flex-1 text-[13px] text-ink-2">{pt.label}</span>
                  <span className="text-[13px] font-medium text-ink">$0.00</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ventas MSI por plazo */}
          <div className="bg-white rounded-xl p-5" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-ink-3">Ventas MSI por plazo</p>
                <p className="text-[24px] font-semibold text-ink mt-0.5 leading-none">$0.00</p>
              </div>
              <Toggle value={msiToggle} onChange={setMsiToggle} />
            </div>

            <div className="mt-4">
              <BarChart
                labels={["3 MSI", "6 MSI", "9 MSI", "12 MSI", "18 MSI", "24 MSI"]}
                data={zeroMsi}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

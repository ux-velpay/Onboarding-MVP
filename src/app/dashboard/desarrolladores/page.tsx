"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SVGProps } from "react";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/cn";
import { VelpayLogo } from "@/components/ui/VelpayLogo";

// ── Icons ─────────────────────────────────────────────────────────
const S = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const IcoEye      = (p: SVGProps<SVGSVGElement>) => <svg width={15} height={15} viewBox="0 0 24 24" {...S} {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>;
const IcoEyeOff   = (p: SVGProps<SVGSVGElement>) => <svg width={15} height={15} viewBox="0 0 24 24" {...S} {...p}><path d="M9.9 4.24A9.1 9.1 0 0 1 12 4c6.5 0 10 7 10 7a13.2 13.2 0 0 1-1.67 2.44M6.1 6.1A13.3 13.3 0 0 0 2 11s3.5 7 10 7a9.1 9.1 0 0 0 4-.9"/><path d="M9.9 9.9a3 3 0 1 0 4.2 4.2M2 2l20 20"/></svg>;
const IcoX        = (p: SVGProps<SVGSVGElement>) => <svg width={18} height={18} viewBox="0 0 24 24" {...S} {...p}><path d="M18 6 6 18M6 6l12 12"/></svg>;
const IcoKey      = (p: SVGProps<SVGSVGElement>) => <svg width={16} height={16} viewBox="0 0 24 24" {...S} {...p}><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3"/></svg>;
const IcoInfo     = (p: SVGProps<SVGSVGElement>) => <svg width={14} height={14} viewBox="0 0 24 24" {...S} {...p}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>;
const IcoQr       = (p: SVGProps<SVGSVGElement>) => <svg width={14} height={14} viewBox="0 0 24 24" {...S} {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3M17 20h3M20 17v3"/></svg>;
const IcoArrow    = (p: SVGProps<SVGSVGElement>) => <svg width={14} height={14} viewBox="0 0 24 24" {...S} {...p}><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
const IcoClock    = (p: SVGProps<SVGSVGElement>) => <svg width={16} height={16} viewBox="0 0 24 24" {...S} {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

// ── Types ─────────────────────────────────────────────────────────
type UserType = "admin" | "otros";
type FormState = { appName: string; userType: UserType };
type App = {
  id: number;
  appName: string;
  username: string;
  comercio: string;
  sucursal: string;
  storeId: string;
  storeBranchId: string;
  apiKey: string;
};

const MOCK: App[] = [
  { id: 1, appName: "admin23", username: "alexiscajero", comercio: "EDARVA 2", sucursal: "ALEXIS1",  storeId: "1495", storeBranchId: "9175", apiKey: "vpk_demo_XXXXXXXXXXXXXXXXXXXXXXXXXXXX" },
  { id: 2, appName: "admin",   username: "edarva2",      comercio: "EDARVA 2", sucursal: "EDARVA 2", storeId: "1495", storeBranchId: "1497", apiKey: "vpk_demo_YYYYYYYYYYYYYYYYYYYYYYYYYYYY" },
];

// ── Loading overlay ───────────────────────────────────────────────
function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-white gap-8">
      <VelpayLogo />
      <p className="text-[15px] text-ink-3">Volviendo a tu registro…</p>
      <div className="flex items-center gap-2.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-primary"
            style={{ animation: "vp-dot 1.2s ease-in-out infinite", animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
      <style>{`
        @keyframes vp-dot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40%            { transform: scale(1);   opacity: 1;   }
        }
      `}</style>
    </div>
  );
}

// ── Shared: advance onboarding past sync-terminal before returning ─
function goToOnboarding(router: ReturnType<typeof useRouter>) {
  try {
    const raw = localStorage.getItem("velpay-onboarding-v12");
    if (raw) {
      const state = JSON.parse(raw);
      if (state.screen === "sync-terminal" || state.screen === "business-data") {
        state.history = [...(state.history ?? []), state.screen];
        state.screen = "person-type";
        localStorage.setItem("velpay-onboarding-v12", JSON.stringify(state));
      }
    }
  } catch { /* noop */ }
  sessionStorage.setItem("vp-onboarding-origin", "dashboard");
  router.push("/");
}

// ── Days left constant ────────────────────────────────────────────
const DAYS_LEFT = 15; // TODO: replace with real value from API

// ── Registration banner ───────────────────────────────────────────
function RegistroBanner() {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    setLoading(true);
    setTimeout(() => goToOnboarding(router), 1800);
  };

  if (dismissed) return null;

  return (
    <>
      {loading && <LoadingOverlay />}
      <div className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3 bg-purple-100">
        {/* Clock icon */}
        <span className="shrink-0 w-9 h-9 rounded-full bg-primary flex items-center justify-center">
          <IcoClock className="text-white" />
        </span>

        {/* Text + CTA stacked */}
        <div className="flex-1 min-w-0">
          <p className="text-[14px] text-ink leading-snug">
            Tienes <span className="font-semibold">{DAYS_LEFT} días</span> para completar tu registro
          </p>
          <button
            onClick={handleContinue}
            disabled={loading}
            className="inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:text-primary-hover transition-colors mt-0.5"
          >
            Completar <IcoArrow />
          </button>
        </div>

        {/* Dismiss */}
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 p-1 text-ink-3 hover:text-ink transition-colors"
          aria-label="Cerrar"
        >
          <IcoX width={16} height={16} />
        </button>
      </div>
    </>
  );
}

// ── Floating registration card ────────────────────────────────────
function FloatingRegistroCard() {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    setLoading(true);
    setTimeout(() => goToOnboarding(router), 1800);
  };

  if (dismissed) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 z-40 bg-white rounded-2xl p-5 animate-step"
      style={{ boxShadow: "var(--shadow-lg)" }}
    >
      {loading && <LoadingOverlay />}

      {/* Title + X */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <p className="text-[18px] font-semibold text-ink leading-snug">Completa tu registro</p>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-ink-3 hover:text-ink transition-colors shrink-0 -mt-0.5 -mr-0.5"
          aria-label="Cerrar"
        >
          <IcoX width={18} height={18} />
        </button>
      </div>

      {/* Body */}
      <p className="text-[15px] text-ink-2 leading-relaxed mb-5">
        Tienes <span className="font-semibold text-ink">{DAYS_LEFT} días</span> para subir tus documentos y activar tu cuenta.
      </p>

      <button
        onClick={handleContinue}
        disabled={loading}
        className="w-full h-12 rounded-full bg-primary text-white text-[15px] font-medium hover:bg-primary-hover transition-colors disabled:opacity-60"
      >
        Continuar configuración
      </button>
    </div>
  );
}

// ── Radio option ──────────────────────────────────────────────────
function RadioOption({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none" onClick={onChange}>
      <span className={cn(
        "w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
        checked ? "border-primary-dark bg-primary-dark" : "border-line-strong bg-white"
      )}>
        {checked && <span className="w-[8px] h-[8px] rounded-full bg-white" />}
      </span>
      <span className="text-[14px] text-ink">{label}</span>
    </label>
  );
}

// ── Modal — always centered ───────────────────────────────────────
function GenerarKeyModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (d: FormState) => void }) {
  const [appName, setAppName] = useState("");
  const [userType, setUserType] = useState<UserType>("admin");
  const valid = appName.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl w-full max-w-[460px] shadow-lg animate-step">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-line">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-primary">
              <IcoKey />
            </span>
            <h2 className="text-[16px] font-semibold text-primary-dark">Generar API key</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface text-ink-3 transition-colors" aria-label="Cerrar">
            <IcoX />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={(e) => { e.preventDefault(); if (valid) onSubmit({ appName: appName.trim(), userType }); }}
          className="px-5 py-5 space-y-5"
        >
          {/* App name */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-[14px] font-medium text-ink">
              Nombre de la aplicación <IcoInfo className="text-ink-3" />
            </label>
            <input
              autoFocus
              type="text"
              placeholder="Nombre de la aplicación"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-line-strong bg-white text-[14px] text-ink placeholder:text-placeholder focus:outline-none focus:border-primary focus:ring-2 focus:ring-[rgba(117,75,241,0.2)] transition"
            />
          </div>

          {/* User type */}
          <div className="flex items-center gap-8">
            <RadioOption label="Administrador"  checked={userType === "admin"} onChange={() => setUserType("admin")} />
            <RadioOption label="Otros usuarios" checked={userType === "otros"} onChange={() => setUserType("otros")} />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 h-12 rounded-xl border border-line-strong text-[14px] font-medium text-ink hover:bg-surface transition-colors">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!valid}
              className={cn(
                "flex-1 h-12 rounded-xl text-white text-[14px] font-semibold transition-colors",
                valid ? "bg-primary hover:bg-primary-hover shadow-[0_1px_2px_rgba(45,0,109,0.25)]" : "bg-line text-ink-3 cursor-not-allowed"
              )}
            >
              Generar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── QR Modal ─────────────────────────────────────────────────────
function QrModal({ app, onClose }: { app: App; onClose: () => void }) {
  const qrValue = JSON.stringify({
    appName: app.appName,
    storeId: app.storeId,
    storeBranchId: app.storeBranchId,
    apiKey: app.apiKey,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-3xl w-full max-w-[480px] shadow-lg animate-step overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          <h2 className="text-[20px] font-semibold text-ink">Escanea el QR</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface flex items-center justify-center text-ink-3 hover:bg-line transition-colors"
            aria-label="Cerrar"
          >
            <IcoX />
          </button>
        </div>

        {/* QR code */}
        <div className="flex items-center justify-center px-6 py-8">
          <QRCodeSVG
            value={qrValue}
            size={220}
            level="M"
            marginSize={1}
          />
        </div>
      </div>
    </div>
  );
}

// ── App card (mobile view) ────────────────────────────────────────
function AppCard({ app, visible, onToggleKey, onQr }: { app: App; visible: boolean; onToggleKey: () => void; onQr: () => void }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="px-4 pt-4 pb-3 border-b border-line">
        <p className="font-semibold text-[15px] text-ink">{app.appName}</p>
        <p className="text-[13px] text-ink-3 mt-0.5">{app.username}</p>
      </div>

      <div className="px-4 py-3 grid grid-cols-2 gap-x-4 gap-y-3 border-b border-line">
        {[["Comercio", app.comercio], ["Sucursal", app.sucursal], ["Store ID", app.storeId], ["Store Branch ID", app.storeBranchId]].map(([lbl, val]) => (
          <div key={lbl}>
            <p className="text-[11px] font-medium text-ink-3 uppercase tracking-wide mb-0.5">{lbl}</p>
            <p className="text-[13px] font-semibold text-ink">{val}</p>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 border-b border-line">
        <p className="text-[11px] font-medium text-ink-3 uppercase tracking-wide mb-2">API key</p>
        <div className="flex items-center gap-3">
          <span
            className="font-mono text-[12px] text-ink-3 flex-1 truncate transition-all duration-200"
            style={{ filter: visible ? "none" : "blur(4px)", userSelect: visible ? "text" : "none" }}
          >
            {app.apiKey}
          </span>
          <button onClick={onToggleKey} className="flex items-center gap-1.5 text-[13px] text-ink-2 hover:text-ink transition-colors shrink-0 whitespace-nowrap">
            {visible ? <IcoEyeOff /> : <IcoEye />}
            {visible ? "Ocultar" : "Ver"}
          </button>
        </div>
      </div>

      <div className="px-4 py-3">
        <button onClick={onQr} className="flex items-center gap-1.5 text-[13px] font-medium text-primary hover:text-primary-hover transition-colors">
          <IcoQr /> Generar QR
        </button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────
export default function DesarrolladoresPage() {
  const [apps, setApps] = useState<App[]>(MOCK);
  const [showModal, setShowModal] = useState(false);
  const [qrApp, setQrApp] = useState<App | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<number>>(new Set());

  const toggleKey = (id: number) =>
    setVisibleKeys((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleCreate = (data: FormState) => {
    setApps((prev) => [...prev, {
      id: Date.now(),
      appName: data.appName,
      username: data.userType === "admin" ? "administrador" : "usuario",
      comercio: "EDARVA 2",
      sucursal: "EDARVA 2",
      storeId: "1495",
      storeBranchId: String(Math.floor(Math.random() * 9000) + 1000),
      apiKey: `sk_live_${crypto.randomUUID().replace(/-/g, "").slice(0, 28)}`,
    }]);
    setShowModal(false);
  };

  return (
    <>
      <RegistroBanner />

      <div className="p-4 md:p-6 space-y-4">

        {/* ── Header ── */}
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-[20px] md:text-[22px] font-bold text-primary-dark">Desarrolladores</h1>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 h-10 rounded-lg bg-primary-dark text-white text-[13px] font-semibold hover:bg-primary-hover transition-colors shadow-[0_1px_2px_rgba(45,0,109,0.3)] shrink-0"
          >
            <IcoKey />
            Generar API key
          </button>
        </div>

        {/* ── Mobile: cards (mob-show) ── */}
        <div className="mob-show space-y-3">
          {apps.length === 0 ? (
            <p className="text-center text-sm text-ink-3 py-10">No hay API keys registradas.</p>
          ) : (
            apps.map((app) => (
              <AppCard key={app.id} app={app} visible={visibleKeys.has(app.id)} onToggleKey={() => toggleKey(app.id)} onQr={() => setQrApp(app)} />
            ))
          )}
        </div>

        {/* ── Desktop: table (desk-show) ── */}
        <div className="desk-show bg-white rounded-xl overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
          {/* Tabs */}
          <div className="px-6 border-b border-line">
            <button className="text-[13px] font-semibold text-primary border-b-2 border-primary py-3">
              Enabler
            </button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line">
                {["Nombre de aplicación","Nombre de usuario","Comercio","Sucursal","Store ID","Store Branch ID","API key",""].map((h, i) => (
                  <th key={i} className={cn("py-4 text-[12px] font-semibold text-ink-2 whitespace-nowrap", i === 0 ? "pl-6 pr-4 text-left" : i === 7 ? "pl-4 pr-6" : "px-4 text-left")}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {apps.map((app) => {
                const visible = visibleKeys.has(app.id);
                return (
                  <tr key={app.id} className="hover:bg-surface/60 transition-colors">
                    <td className="pl-6 pr-4 py-4 text-[13px] text-ink">{app.appName}</td>
                    <td className="px-4 py-4 text-[13px] text-ink">{app.username}</td>
                    <td className="px-4 py-4 text-[13px] text-ink">{app.comercio}</td>
                    <td className="px-4 py-4 text-[13px] text-ink">{app.sucursal}</td>
                    <td className="px-4 py-4 text-[13px] text-ink">{app.storeId}</td>
                    <td className="px-4 py-4 text-[13px] text-ink">{app.storeBranchId}</td>
                    <td className="px-4 py-4">
                      <span className="font-mono text-[11px] text-ink-3 block max-w-[140px] truncate transition-all duration-200"
                        style={{ filter: visible ? "none" : "blur(4px)", userSelect: visible ? "text" : "none" }}>
                        {app.apiKey}
                      </span>
                    </td>
                    <td className="pl-4 pr-6 py-4">
                      <div className="flex items-center gap-5 whitespace-nowrap justify-end">
                        <button onClick={() => toggleKey(app.id)} className="flex items-center gap-1.5 text-[13px] text-ink-2 hover:text-ink transition-colors">
                          {visible ? <IcoEyeOff /> : <IcoEye />} Ver API key
                        </button>
                        <button onClick={() => setQrApp(app)} className="text-[13px] font-medium text-primary hover:text-primary-hover transition-colors">
                          Generar QR
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {apps.length === 0 && (
                <tr><td colSpan={8} className="py-14 text-center text-sm text-ink-3">No hay API keys registradas.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && <GenerarKeyModal onClose={() => setShowModal(false)} onSubmit={handleCreate} />}
      {qrApp && <QrModal app={qrApp} onClose={() => setQrApp(null)} />}
      <FloatingRegistroCard />
    </>
  );
}

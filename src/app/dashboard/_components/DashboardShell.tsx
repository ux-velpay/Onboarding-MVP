"use client";
import { useState } from "react";
import type { ReactNode, SVGProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { VelpayLogo } from "@/components/ui/VelpayLogo";
import { cn } from "@/lib/cn";

// ── Icons ─────────────────────────────────────────────────────────
const I = {
  width: 18, height: 18, viewBox: "0 0 24 24", fill: "none",
  stroke: "currentColor", strokeWidth: 2,
  strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
};
const IcoMenu   = (p: SVGProps<SVGSVGElement>) => <svg {...I} {...p}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const IcoDash   = (p: SVGProps<SVGSVGElement>) => <svg {...I} {...p}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
const IcoVentas = (p: SVGProps<SVGSVGElement>) => <svg {...I} {...p}><path d="M4 2v20l3-2 3 2 3-2 3 2 3-2V2l-3 2-3-2-3 2-3-2-3 2z"/><path d="M8 10h8M8 14h5"/></svg>;
const IcoReport = (p: SVGProps<SVGSVGElement>) => <svg {...I} {...p}><rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="7" width="4" height="14" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></svg>;
const IcoBuild  = (p: SVGProps<SVGSVGElement>) => <svg {...I} {...p}><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M9 7h.01M15 7h.01M9 11h.01M15 11h.01M9 15h.01M15 15h.01"/></svg>;
const IcoUsers  = (p: SVGProps<SVGSVGElement>) => <svg {...I} {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IcoGear   = (p: SVGProps<SVGSVGElement>) => <svg {...I} {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
const IcoCode   = (p: SVGProps<SVGSVGElement>) => <svg {...I} {...p}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
const IcoLogout = (p: SVGProps<SVGSVGElement>) => <svg {...I} {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const IcoClose  = (p: SVGProps<SVGSVGElement>) => <svg {...I} width={20} height={20} {...p}><path d="M18 6 6 18M6 6l12 12"/></svg>;
const IcoChevDown = (p: SVGProps<SVGSVGElement>) => <svg {...I} width={16} height={16} {...p}><path d="m6 9 6 6 6-6"/></svg>;
const IcoChevUp   = (p: SVGProps<SVGSVGElement>) => <svg {...I} width={16} height={16} {...p}><path d="m18 15-6-6-6 6"/></svg>;

// ── Nav structure ─────────────────────────────────────────────────
type NavChild = { label: string; href: string };
type NavItem  = {
  label: string;
  href: string | null;
  Icon: (p: SVGProps<SVGSVGElement>) => React.ReactElement;
  children?: NavChild[];
};

const NAV: NavItem[] = [
  { label: "Dashboard",       href: "/dashboard",                    Icon: IcoDash   },
  { label: "Ventas",          href: null,                            Icon: IcoVentas,
    children: [
      { label: "Transacciones", href: "/dashboard/ventas/transacciones" },
      { label: "Ligas de pago", href: "/dashboard/ventas/ligas"        },
    ],
  },
  { label: "Reportes",        href: null,                            Icon: IcoReport, children: [] },
  { label: "Sucursales",      href: "#sucursales",                   Icon: IcoBuild  },
  { label: "Usuarios",        href: "#usuarios",                     Icon: IcoUsers  },
  { label: "Perfil",          href: null,                            Icon: IcoGear,   children: [] },
  { label: "Desarrolladores", href: "/dashboard/desarrolladores",    Icon: IcoCode   },
];

// ── Sidebar content ───────────────────────────────────────────────
function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  const initOpen = (): Set<string> => {
    const s = new Set<string>();
    NAV.forEach(item => {
      if (item.children?.some(c => pathname.startsWith(c.href))) s.add(item.label);
    });
    return s;
  };

  const [openMenus, setOpenMenus] = useState<Set<string>>(initOpen);

  const toggle = (label: string) =>
    setOpenMenus(prev => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 pt-5 pb-5">
        <VelpayLogo />
        {onClose && (
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface text-ink-3 transition-colors" aria-label="Cerrar menú">
            <IcoClose />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 overflow-y-auto space-y-0.5">
        {NAV.map((item) => {
          const hasChildren = !!item.children?.length;
          const isOpen      = openMenus.has(item.label);
          const isActive    = item.href ? pathname === item.href : false;
          const isParentActive = hasChildren && item.children!.some(c => pathname.startsWith(c.href));

          // ── Collapsible parent ──
          if (item.children !== undefined) {
            return (
              <div key={item.label}>
                <button
                  onClick={() => hasChildren && toggle(item.label)}
                  className={cn(
                    "flex w-full items-center gap-3 px-3 py-[9px] rounded-lg text-[13.5px] font-medium transition-colors",
                    isParentActive ? "text-primary-dark" : "text-ink-2 hover:bg-surface",
                    !hasChildren && "cursor-default"
                  )}
                >
                  <item.Icon className={cn("shrink-0", isParentActive ? "text-primary" : "text-ink-3")} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {hasChildren && (
                    isOpen
                      ? <IcoChevDown className={isParentActive ? "text-primary" : "text-ink-3"} />
                      : <IcoChevUp   className={isParentActive ? "text-primary" : "text-ink-3"} />
                  )}
                </button>

                {/* Sub-items */}
                {isOpen && hasChildren && (
                  <div className="relative mt-0.5 mb-1 ml-[22px]">
                    {/* Vertical connecting line */}
                    <span className="absolute left-[6px] top-2 bottom-2 w-px bg-line-strong" />

                    {item.children!.map((child) => {
                      const childActive = pathname === child.href;
                      return (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={onClose}
                          className={cn(
                            "flex items-center gap-3 pl-5 pr-3 py-[7px] rounded-lg text-[13px] transition-colors",
                            childActive
                              ? "text-primary font-semibold"
                              : "text-ink-3 hover:text-ink-2"
                          )}
                        >
                          <span className={cn(
                            "w-[8px] h-[8px] rounded-full shrink-0 transition-colors",
                            childActive ? "bg-primary" : "border border-line-strong bg-white"
                          )} />
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // ── Regular item ──
          return (
            <Link
              key={item.label}
              href={item.href!}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-[9px] rounded-lg text-[13.5px] font-medium transition-colors",
                isActive ? "bg-purple-50 text-primary-dark" : "text-ink-2 hover:bg-surface"
              )}
            >
              <item.Icon className={cn("shrink-0", isActive ? "text-primary" : "text-ink-3")} />
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5 pt-3 border-t border-line mt-3">
        <button className="flex w-full items-center gap-3 px-3 py-[9px] rounded-lg text-[13.5px] font-medium text-danger hover:bg-danger-bg transition-colors">
          <IcoLogout />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

// ── DashboardShell ────────────────────────────────────────────────
export function DashboardShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-dvh bg-surface overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="desk-show w-[240px] shrink-0 bg-white border-r border-line overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setOpen(false)} />}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-line overflow-y-auto transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ willChange: "transform" }}
      >
        <SidebarContent onClose={() => setOpen(false)} />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <div className="mob-show-flex items-center gap-3 px-4 h-14 bg-white border-b border-line shrink-0">
          <button onClick={() => setOpen(true)} className="p-1.5 -ml-1.5 rounded-lg hover:bg-surface text-ink-2 transition-colors" aria-label="Abrir menú">
            <IcoMenu />
          </button>
          <VelpayLogo />
        </div>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

import type { ReactNode } from "react";
import { DashboardShell } from "./_components/DashboardShell";

export const metadata = {
  title: "VelPay · Dashboard",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}

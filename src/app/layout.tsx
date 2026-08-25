import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VelPay · Onboarding",
  description:
    "Portal de alta de comercios VelPay — Nivel 0 (Banorte). Expediente dinámico según el perfil del comercio.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${workSans.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}

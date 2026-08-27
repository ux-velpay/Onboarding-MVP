"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { Check, ChevronDown } from "@/components/ui/icons";
import { GIROS } from "@/lib/catalogs";
import { SplitLayout } from "../SplitLayout";
import { WizardHeader } from "../WizardHeader";
import { useOnboarding } from "../provider";
import { StepTitle } from "./StepTitle";

function Detected() {
  return (
    <span className="inline-flex items-center gap-1 text-[12px] font-medium text-success">
      <Check width={13} height={13} /> Detectado
    </span>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-3 mt-1 text-[13px] font-medium uppercase tracking-wide text-ink-3">
      {children}
    </h3>
  );
}

function GiroSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[14px] font-medium text-ink">Giro</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`focus-ring h-[52px] w-full appearance-none rounded-[10px] border border-line bg-white px-4 pr-11 text-[15px] transition-colors ${
            value ? "text-ink" : "text-placeholder"
          }`}
        >
          <option value="" disabled>
            Selecciona el giro de tu negocio
          </option>
          {GIROS.map((g) => (
            <option key={g.id} value={g.id} className="text-ink">
              {g.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-3" />
      </div>
    </label>
  );
}

export function ConfirmData() {
  const { data, update, next } = useOnboarding();
  const isPM = data.personType === "PM";
  const d = data.documentsDone;

  const complete = Boolean(
    data.giroId &&
      data.businessName.trim() &&
      (isPM ? data.razonSocial.trim() : data.nombres.trim() && data.apellidoPaterno.trim())
  );

  return (
    <SplitLayout
      align="start"
      header={<WizardHeader />}
      footer={
        <Button fullWidth disabled={!complete} onClick={next}>
          Confirmar y continuar
        </Button>
      }
    >
      <StepTitle
        title="Confirma tus datos"
        subtitle="Revisa que todo esté correcto y edítalo si hace falta."
      />

      <div className="space-y-5">
        {/* --- Identity --- */}
        <SectionTitle>{isPM ? "Datos del representante" : "Tus datos"}</SectionTitle>
        <TextField
          label={
            <span className="flex w-full items-center justify-between">
              {isPM ? "Nombre del representante" : "Nombre(s)"} {d.ine && <Detected />}
            </span>
          }
          placeholder="Ana María"
          value={data.nombres}
          onChange={(e) => update({ nombres: e.target.value })}
        />
        <TextField
          label="Apellido paterno"
          placeholder="Rodríguez"
          value={data.apellidoPaterno}
          onChange={(e) => update({ apellidoPaterno: e.target.value })}
        />
        <TextField
          label="Apellido materno"
          placeholder="López"
          value={data.apellidoMaterno}
          onChange={(e) => update({ apellidoMaterno: e.target.value })}
        />
        <TextField
          label={<span className="flex w-full items-center justify-between">Domicilio {d.comprobante && <Detected />}</span>}
          placeholder="Calle Primavera 22, Col. Del Valle, CDMX"
          value={data.domicilioFiscal}
          onChange={(e) => update({ domicilioFiscal: e.target.value })}
        />

        {/* --- Business --- */}
        <div className="border-t border-line pt-5">
          <SectionTitle>Datos del negocio</SectionTitle>
          <TextField
            label="Nombre del negocio"
            placeholder="Ej. Boutique Aurora"
            value={data.businessName}
            onChange={(e) => update({ businessName: e.target.value })}
          />
          {isPM && (
            <div className="mt-5">
              <TextField
                label={<span className="flex w-full items-center justify-between">Razón social {d.rfc_constancia && <Detected />}</span>}
                placeholder="Velpay Tecnologías S.A. de C.V."
                value={data.razonSocial}
                onChange={(e) => update({ razonSocial: e.target.value })}
              />
            </div>
          )}
          <div className="mt-5">
            <TextField
              label={
                <span className="flex w-full items-center justify-between">
                  RFC {d.rfc_constancia ? <Detected /> : <span className="text-[12px] text-ink-3">Opcional</span>}
                </span>
              }
              placeholder="Se extrae de tu Constancia de Situación Fiscal"
              value={data.rfc}
              onChange={(e) => update({ rfc: e.target.value.toUpperCase() })}
            />
          </div>
          <div className="mt-5">
            <GiroSelect value={data.giroId ?? ""} onChange={(id) => update({ giroId: id })} />
          </div>
        </div>

        {/* --- Bank --- */}
        <div className="border-t border-line pt-5">
          <SectionTitle>Datos bancarios</SectionTitle>
          <p className="mb-4 text-[13px] leading-relaxed text-ink-3">
            {isPM
              ? "La cuenta debe estar a nombre de la razón social del negocio."
              : "La cuenta y su titular deben coincidir con los de tu estado de cuenta."}
          </p>
          <TextField
            label={<span className="flex w-full items-center justify-between">CLABE {d.estado_cuenta && <Detected />}</span>}
            inputMode="numeric"
            placeholder="072 180 0000 0000 0000"
            value={data.clabe}
            onChange={(e) => update({ clabe: e.target.value })}
          />
          <div className="mt-5">
            <TextField
              label={<span className="flex w-full items-center justify-between">Banco {d.estado_cuenta && <Detected />}</span>}
              placeholder="Banorte"
              value={data.bank}
              onChange={(e) => update({ bank: e.target.value })}
            />
          </div>
          {!isPM && (
            <div className="mt-5">
              <TextField
                label="Titular de la cuenta"
                hint="Debe coincidir con el nombre que aparece en tu estado de cuenta."
                placeholder="Ana María Rodríguez López"
                value={data.accountHolder}
                onChange={(e) => update({ accountHolder: e.target.value })}
              />
            </div>
          )}
        </div>
      </div>
    </SplitLayout>
  );
}

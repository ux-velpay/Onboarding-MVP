"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { Check, ChevronDown } from "@/components/ui/icons";
import { GIROS, MCC_CATALOG, getGiro } from "@/lib/catalogs";
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
    <h3 className="mb-3 mt-1 text-[13px] font-semibold uppercase tracking-wide text-ink-3">
      {children}
    </h3>
  );
}

interface Opt {
  value: string;
  label: string;
}

function CatalogSelect({
  label,
  value,
  placeholder,
  options,
  onChange,
}: {
  label: ReactNode;
  value: string;
  placeholder: string;
  options: Opt[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[14px] font-medium text-ink">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`focus-ring h-[52px] w-full appearance-none rounded-[10px] border border-line bg-white px-4 pr-11 text-[15px] transition-colors ${
            value ? "text-ink" : "text-placeholder"
          }`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value} className="text-ink">
              {o.label}
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

  function selectGiro(id: string) {
    const giro = getGiro(id);
    const mcc = giro
      ? MCC_CATALOG.find((m) => m.startsWith(giro.mcc)) ?? giro.mcc
      : "";
    update({ giroId: id, mcc });
  }

  const complete = Boolean(
    data.giroId &&
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
        <SectionTitle>{isPM ? "Datos de la empresa" : "Tus datos"}</SectionTitle>
        {isPM && (
          <TextField
            label={<span className="flex w-full items-center justify-between">Razón social {d.rfc_constancia && <Detected />}</span>}
            placeholder="Velpay Tecnologías S.A. de C.V."
            value={data.razonSocial}
            onChange={(e) => update({ razonSocial: e.target.value })}
          />
        )}
        <TextField
          label={
            <span className="flex w-full items-center justify-between">
              {isPM ? "Representante — Nombre(s)" : "Nombre(s)"} {d.ine && <Detected />}
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
          label={
            <span className="flex w-full items-center justify-between">
              RFC {d.rfc_constancia ? <Detected /> : <span className="text-[12px] text-ink-3">Opcional</span>}
            </span>
          }
          placeholder="Se completará con tu constancia"
          value={data.rfc}
          onChange={(e) => update({ rfc: e.target.value.toUpperCase() })}
        />
        <TextField
          label={<span className="flex w-full items-center justify-between">Domicilio {d.comprobante && <Detected />}</span>}
          placeholder="Calle Primavera 22, Col. Del Valle, CDMX"
          value={data.domicilioFiscal}
          onChange={(e) => update({ domicilioFiscal: e.target.value })}
        />

        <div className="border-t border-line pt-5">
          <SectionTitle>Tu negocio</SectionTitle>
          <CatalogSelect
            label="Giro"
            placeholder="Selecciona el giro de tu negocio"
            value={data.giroId ?? ""}
            options={GIROS.map((g) => ({ value: g.id, label: g.label }))}
            onChange={selectGiro}
          />
          <div className="mt-5">
            <CatalogSelect
              label="MCC"
              placeholder="Se asigna según el giro"
              value={data.mcc}
              options={MCC_CATALOG.map((m) => ({ value: m, label: m }))}
              onChange={(v) => update({ mcc: v })}
            />
          </div>
        </div>

        <div className="border-t border-line pt-5">
          <SectionTitle>Datos bancarios</SectionTitle>
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
        </div>
      </div>
    </SplitLayout>
  );
}

"use client";

import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { Check } from "@/components/ui/icons";
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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 mt-1 text-[13px] font-semibold uppercase tracking-wide text-ink-3">
      {children}
    </h3>
  );
}

export function ConfirmData() {
  const { data, update, next } = useOnboarding();
  const isPM = data.personType === "PM";
  const d = data.documentsDone;

  const complete =
    data.businessName.trim() !== "" &&
    data.email.trim() !== "" &&
    (isPM ? data.razonSocial.trim() !== "" : data.nombreCompleto.trim() !== "");

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
        subtitle="Extrajimos esto de tus documentos. Revisa que todo esté correcto y edítalo si hace falta."
      />

      <div className="space-y-5">
        <SectionTitle>Tus datos</SectionTitle>
        {isPM ? (
          <>
            <TextField
              label={<span className="flex w-full items-center justify-between">Razón social {d.rfc_constancia && <Detected />}</span>}
              placeholder="Velpay Tecnologías S.A. de C.V."
              value={data.razonSocial}
              onChange={(e) => update({ razonSocial: e.target.value })}
            />
            <TextField
              label={<span className="flex w-full items-center justify-between">Representante legal {d.ine && <Detected />}</span>}
              placeholder="David Alejandro Gómez"
              value={data.representanteLegal}
              onChange={(e) => update({ representanteLegal: e.target.value })}
            />
          </>
        ) : (
          <TextField
            label={<span className="flex w-full items-center justify-between">Nombre completo {d.ine && <Detected />}</span>}
            placeholder="Ana María Rodríguez López"
            value={data.nombreCompleto}
            onChange={(e) => update({ nombreCompleto: e.target.value })}
          />
        )}
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
          <TextField
            label="Nombre comercial"
            placeholder="Ej. Boutique Aurora"
            value={data.businessName}
            onChange={(e) => update({ businessName: e.target.value })}
          />
          <div className="mt-5">
            <TextField
              label="Correo electrónico"
              type="email"
              placeholder="contacto@minegocio.com"
              value={data.email}
              onChange={(e) => update({ email: e.target.value })}
            />
          </div>
          <div className="mt-5">
            <TextField
              label="Teléfono"
              placeholder="55 1234 5678"
              value={data.phone}
              onChange={(e) => update({ phone: e.target.value })}
            />
          </div>
        </div>

        <div className="border-t border-line pt-5">
          <SectionTitle>Datos bancarios</SectionTitle>
          <TextField
            label={<span className="flex w-full items-center justify-between">Banco {d.estado_cuenta && <Detected />}</span>}
            placeholder="Banorte"
            value={data.bank}
            onChange={(e) => update({ bank: e.target.value })}
          />
          <div className="mt-5">
            <TextField
              label={<span className="flex w-full items-center justify-between">CLABE {d.estado_cuenta && <Detected />}</span>}
              inputMode="numeric"
              placeholder="072 180 0000 0000 0000"
              value={data.clabe}
              onChange={(e) => update({ clabe: e.target.value })}
            />
          </div>
          <div className="mt-5">
            <TextField
              label="Titular de la cuenta"
              placeholder="A nombre del comercio"
              value={data.accountHolder}
              onChange={(e) => update({ accountHolder: e.target.value })}
            />
          </div>
        </div>
      </div>
    </SplitLayout>
  );
}

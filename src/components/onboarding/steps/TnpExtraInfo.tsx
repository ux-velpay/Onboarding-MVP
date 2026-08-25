"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { SelectField } from "@/components/ui/SelectField";
import { TextArea, TextField } from "@/components/ui/TextField";
import { POLITICAS_DEVOLUCION } from "@/lib/catalogs";
import { SplitLayout } from "../SplitLayout";
import { WizardHeader } from "../WizardHeader";
import { useOnboarding } from "../provider";
import { StepTitle } from "./StepTitle";

function UploadBlock({ label, description, button }: { label: string; description: string; button: string }) {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p className="mb-2 text-[14px] font-medium text-ink">{label}</p>
      <div className="rounded-[12px] bg-surface p-4">
        <p className="mb-3 text-[14px] leading-snug text-ink-3">{description}</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCount((c) => c + 1)}
            className="focus-ring rounded-[9px] bg-primary-dark px-4 py-2 text-[14px] font-medium text-white transition-colors hover:bg-primary-hover"
          >
            {button}
          </button>
          <span className="text-[13px] text-ink-3">{count} archivos cargados</span>
        </div>
      </div>
    </div>
  );
}

export function TnpExtraInfo() {
  const { data, update, next } = useOnboarding();
  return (
    <SplitLayout
      align="start"
      header={<WizardHeader />}
      footer={
        <Button fullWidth onClick={next}>
          Continuar
        </Button>
      }
    >
      <StepTitle title="Información de tu negocio en línea" />
      <div className="space-y-5">
        <TextField
          label="URL del sitio"
          placeholder="https://mitienda.com"
          hint="Ingresa la URL principal de tu tienda en línea"
          value={data.tnp.url}
          onChange={(e) => update({ tnp: { ...data.tnp, url: e.target.value } })}
        />
        <TextField
          label="Productos y servicios"
          placeholder="Ropa de diseño, calzado y accesorios de moda"
          hint="Describe brevemente tu oferta comercial"
          value={data.tnp.products}
          onChange={(e) => update({ tnp: { ...data.tnp, products: e.target.value } })}
        />
        <TextArea
          label="Descripción de actividad"
          placeholder="Fabricamos y distribuimos prendas confeccionadas a mano..."
          hint="Esta información nos ayudará a validar tu perfil comercial"
          value={data.tnp.description}
          onChange={(e) => update({ tnp: { ...data.tnp, description: e.target.value } })}
        />
        <SelectField
          label="Políticas de entrega/cancelación/devolución"
          placeholder="Selecciona la política aplicable a tu negocio"
          options={POLITICAS_DEVOLUCION}
          value={data.tnp.policies}
          onChange={(e) => update({ tnp: { ...data.tnp, policies: e.target.value } })}
        />
        <TextField
          label="Flujo de pago del sitio"
          placeholder="Pago en línea con tarjeta, transferencia y PayPal"
          hint="Describe el flujo de cobro y confirmación de compra"
          value={data.tnp.paymentFlow}
          onChange={(e) => update({ tnp: { ...data.tnp, paymentFlow: e.target.value } })}
        />
        <UploadBlock
          label="Evidencia del sitio - capturas de pantalla"
          description="Sube al menos 3 capturas: inicio, pago y políticas. Archivos PDF o PNG/JPG."
          button="Subir capturas"
        />
        <UploadBlock
          label="Catálogo de productos/servicios"
          description="Sube un documento PDF o XLSX con tu oferta actual."
          button="Subir documento"
        />
        <UploadBlock
          label="Materiales de mercadotecnia"
          description="Sube logos, banners o guías visuales de tu marca."
          button="Subir archivos"
        />
      </div>
    </SplitLayout>
  );
}

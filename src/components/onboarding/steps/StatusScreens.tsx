"use client";

import { Button } from "@/components/ui/Button";
import { IconBadge } from "@/components/ui/IconBadge";
import { InfoBox } from "@/components/ui/InfoBox";
import { UploadField } from "@/components/ui/UploadField";
import { AlertCircle, BadgeCheck, FileCheck, XCircle } from "@/components/ui/icons";
import { SplitLayout } from "../SplitLayout";
import { WizardHeader } from "../WizardHeader";
import { useOnboarding } from "../provider";
import { StepTitle } from "./StepTitle";

/* ---- Screen 4 · Enviado -------------------------------------------------- */
export function StatusEnviado() {
  const { go } = useOnboarding();
  return (
    <SplitLayout
      header={<WizardHeader step={4} />}
      footer={
        <Button fullWidth onClick={() => go("status-aprobado")}>
          Ver mi expediente
        </Button>
      }
    >
      <IconBadge icon={FileCheck} tone="dark" className="mb-6" />
      <StepTitle
        title="Tu expediente fue enviado"
        subtitle="Hemos enviado tu expediente a Banorte para su revisión."
      />
      <InfoBox>
        <dl className="space-y-1.5">
          <div>
            <span className="text-ink-3">Estado: </span>
            <span className="font-semibold text-alert">En revisión por Banorte</span>
          </div>
          <div>
            <span className="text-ink-3">Fecha: </span>
            <span className="text-ink">25 agosto 2026</span>
          </div>
          <div>
            <span className="text-ink-3">Tiempo estimado: </span>
            <span className="text-ink">24-48 horas hábiles</span>
          </div>
        </dl>
      </InfoBox>
    </SplitLayout>
  );
}

/* ---- Screen 5 · Información adicional ------------------------------------ */
export function StatusInfoAdicional() {
  const { go } = useOnboarding();
  return (
    <SplitLayout
      align="start"
      header={<WizardHeader step={5} />}
      footer={
        <Button fullWidth onClick={() => go("status-aprobado")}>
          Enviar información
        </Button>
      }
    >
      <IconBadge icon={AlertCircle} tone="alert" className="mb-6" />
      <StepTitle
        title="Banorte solicita información adicional"
        subtitle="Para continuar con tu proceso, requerimos los siguientes documentos aclaratorios:"
      />
      <div className="space-y-5">
        <div>
          <p className="mb-2 text-[14px] font-medium text-ink">
            1. Comprobante de domicilio actualizado
          </p>
          <UploadField text="Subir comprobante de domicilio (PDF o imagen)" buttonLabel="Cargar" />
        </div>
        <div>
          <p className="mb-2 text-[14px] font-medium text-ink">
            2. Aclaración sobre actividad declarada
          </p>
          <UploadField text="Subir carta aclaratoria firmada" buttonLabel="Cargar" />
        </div>
      </div>
    </SplitLayout>
  );
}

/* ---- Screen 6 · Aprobado ------------------------------------------------- */
export function StatusAprobado() {
  const { reset } = useOnboarding();
  return (
    <SplitLayout
      header={<WizardHeader step={7} />}
      footer={
        <Button fullWidth onClick={reset}>
          Entendido
        </Button>
      }
    >
      <IconBadge icon={BadgeCheck} tone="dark" className="mb-6" />
      <StepTitle
        title="¡Tu negocio fue aprobado!"
        subtitle="¡Felicidades! Banorte ha validado exitosamente toda tu información. Tu cuenta está lista para operar."
      />
      <InfoBox tone="success" title="Próximo paso: activaremos tu terminal.">
        Recibirás un correo de confirmación con las instrucciones finales de acceso y
        envío de tus terminales.
      </InfoBox>
    </SplitLayout>
  );
}

/* ---- Screen 7 · Rechazado ------------------------------------------------ */
export function StatusRechazado() {
  const { reset } = useOnboarding();
  return (
    <SplitLayout
      header={<WizardHeader step={7} />}
      footer={
        <div className="space-y-3">
          <Button fullWidth onClick={reset}>
            Iniciar nueva solicitud
          </Button>
          <Button variant="secondary" fullWidth>
            Contactar soporte
          </Button>
        </div>
      }
    >
      <IconBadge icon={XCircle} tone="danger" className="mb-6" />
      <StepTitle
        title="Tu solicitud no fue aprobada"
        subtitle="Lamentablemente, no pudimos procesar tu solicitud de afiliación en esta ocasión."
      />
      <InfoBox title="Motivo de resolución:">
        La actividad comercial declarada no cumple con las políticas internas de riesgo
        del banco adquirente (Giro restringido).
      </InfoBox>
    </SplitLayout>
  );
}

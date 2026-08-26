"use client";

import { Button } from "@/components/ui/Button";
import { IconBadge } from "@/components/ui/IconBadge";
import { InfoBox } from "@/components/ui/InfoBox";
import { VelpayLogo } from "@/components/ui/VelpayLogo";
import { AlertTriangle, BadgeCheck } from "@/components/ui/icons";
import { hasPendingCorporateDocs } from "@/lib/documents";
import { SplitLayout } from "../SplitLayout";
import { useOnboarding } from "../provider";

export function Complete() {
  const { data, next } = useOnboarding();
  const pending = hasPendingCorporateDocs(data);

  return (
    <SplitLayout
      align="start"
      header={<VelpayLogo />}
      footer={
        <div className="space-y-4 text-center">
          <Button fullWidth onClick={next}>
            Ver mi solicitud
          </Button>
          <p className="text-[14px] text-ink-3">
            ¿Tienes dudas sobre el proceso?{" "}
            <span className="font-semibold text-primary">Contacta a soporte aquí</span>
          </p>
        </div>
      }
    >
      <IconBadge icon={BadgeCheck} tone="dark" className="mb-6" />
      <h2 className="text-[28px] font-medium leading-tight tracking-tight text-primary-dark">
        ¡Tu solicitud está en camino!
      </h2>
      <p className="mb-6 mt-3 max-w-[460px] text-[15px] leading-relaxed text-ink-3">
        Recibimos tus datos y documentos correctamente. El equipo de Velpay iniciará la
        revisión para tu aprobación bancaria.
      </p>
      <div className="space-y-3">
        <InfoBox title="Tiempo estimado de respuesta" icon={AlertTriangle}>
          La validación ante la mesa de control de Banorte toma habitualmente entre 24 y
          48 horas hábiles. Te avisaremos por correo en cuanto tu cuenta esté activa.
        </InfoBox>
        {pending && (
          <div className="rounded-[12px] bg-alert-bg p-4">
            <div className="mb-1.5 flex items-center gap-2 text-[15px] font-semibold text-alert">
              <AlertTriangle width={18} height={18} />
              Documentos corporativos pendientes
            </div>
            <p className="text-[14px] leading-relaxed text-ink-2">
              Tu registro continúa, pero para operar necesitarás subir tu acta
              constitutiva y poder notarial más adelante desde el portal de documentos.
              Te enviaremos el enlace por correo.
            </p>
          </div>
        )}
      </div>
    </SplitLayout>
  );
}

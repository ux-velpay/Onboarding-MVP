"use client";

import { Button } from "@/components/ui/Button";
import { IconBadge } from "@/components/ui/IconBadge";
import { InfoBox } from "@/components/ui/InfoBox";
import { VelpayLogo } from "@/components/ui/VelpayLogo";
import { AlertTriangle, BadgeCheck } from "@/components/ui/icons";
import { SplitLayout } from "../SplitLayout";
import { useOnboarding } from "../provider";

export function Complete() {
  const { next } = useOnboarding();
  return (
    <SplitLayout
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
        ¡Tu expediente está completo!
      </h2>
      <p className="mb-6 mt-3 max-w-[460px] text-[15px] leading-relaxed text-ink-3">
        Hemos recibido todos tus datos y documentos correctamente. El equipo técnico
        de Velpay iniciará la revisión para tu aprobación bancaria.
      </p>
      <InfoBox title="Tiempo estimado de respuesta" icon={AlertTriangle}>
        La validación ante la mesa de control de Banorte toma habitualmente entre 24 y
        48 horas hábiles. Te enviaremos un correo tan pronto tu terminal y accesos
        estén activos.
      </InfoBox>
    </SplitLayout>
  );
}

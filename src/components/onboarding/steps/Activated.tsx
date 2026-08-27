"use client";

import { VelpayLogo } from "@/components/ui/VelpayLogo";
import { AlertCircle, ExternalLink } from "@/components/ui/icons";
import { isGiroBlocked } from "@/lib/rules-engine";
import { SplitLayout } from "../SplitLayout";
import { useOnboarding } from "../provider";

/** Additional documents requested later in the Assistant (§7, BR-018). */
function additionalDocs(data: {
  personType: string | null;
  rfc: string;
  documentsDone: Record<string, boolean>;
}): string[] {
  if (data.personType === "PM") {
    const docs = ["Poderes del representante legal"];
    if (!data.documentsDone.acta) docs.unshift("Acta constitutiva");
    return docs;
  }
  if (data.rfc.trim() !== "") {
    return ["Alta de Hacienda y/o comprobante de RFC del comercio"];
  }
  // PF sin RFC — the system handles Anexo B + giro 5399, no extra docs.
  return [];
}

export function Activated() {
  const { data, next } = useOnboarding();
  const held = isGiroBlocked(data.giroId);

  // Giro prohibido / restringido — internal handling. The account is created,
  // processing is held for Mesa de Control, and the merchant sees a neutral
  // message (never "tu giro está prohibido").
  if (held) {
    return (
      <SplitLayout align="center">
        <div className="w-full max-w-[460px]">
          <h2 className="text-[26px] font-medium leading-tight tracking-tight text-primary-dark">
            Estamos revisando la información de tu negocio
          </h2>
          <div className="mt-8 rounded-[16px] border border-line bg-surface p-5">
            <div className="flex gap-3">
              <AlertCircle className="mt-0.5 shrink-0 text-primary" width={18} height={18} />
              <p className="text-[14px] leading-relaxed text-ink-2">
                Tu registro se creó correctamente. Nuestro equipo revisará los datos de
                tu negocio antes de activar el procesamiento de pagos. Te avisaremos por
                correo en cuanto tu cuenta esté lista, normalmente en 24–48 horas hábiles.
              </p>
            </div>
          </div>
          <div className="mt-8">
            <VelpayLogo />
          </div>
        </div>
      </SplitLayout>
    );
  }

  const pending = additionalDocs(data);

  return (
    <SplitLayout align="center">
      <div className="w-full max-w-[460px]">
        <h2 className="text-[26px] font-medium leading-tight tracking-tight text-primary-dark">
          ¡Felicidades! ya puedes empezar a transaccionar en tu terminal.
        </h2>

        <div className="mt-8 rounded-[16px] border border-line bg-purple-50/60 p-5">
          <div className="flex gap-3">
            <AlertCircle className="mt-0.5 shrink-0 text-primary" width={18} height={18} />
            <div>
              <p className="text-[14px] leading-relaxed text-ink-2">
                Para poder recibir el pago de tus transacciones, completa el registro de
                tu negocio desde el Assistant.
              </p>
              {pending.length > 0 ? (
                <>
                  <p className="mt-3 text-[13px] font-medium text-ink">
                    Más adelante te pediremos:
                  </p>
                  <ul className="mt-1.5 space-y-1.5 text-[14px] text-ink-2">
                    {pending.map((t) => (
                      <li key={t} className="flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-ink-3" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="mt-3 text-[14px] text-ink-2">
                  No necesitas documentos adicionales: el Anexo B y el giro 5399 los
                  gestiona el sistema por ti.
                </p>
              )}
              <button
                type="button"
                onClick={next}
                className="focus-ring mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-primary underline"
              >
                Continuar con tu registro de negocio
                <ExternalLink width={15} height={15} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <VelpayLogo />
        </div>
      </div>
    </SplitLayout>
  );
}

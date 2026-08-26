"use client";

import { VelpayLogo } from "@/components/ui/VelpayLogo";
import { AlertCircle, AlertTriangle, ExternalLink } from "@/components/ui/icons";
import { hasPendingCorporateDocs } from "@/lib/documents";
import { SplitLayout } from "../SplitLayout";
import { useOnboarding } from "../provider";

export function Activated() {
  const { data, next } = useOnboarding();
  const pending = hasPendingCorporateDocs(data);

  return (
    <SplitLayout align="center">
      <div className="w-full max-w-[460px]">
        <h2 className="text-[26px] font-semibold leading-tight tracking-tight text-primary-dark">
          ¡Felicidades! ya puedes empezar a transaccionar en tu terminal.
        </h2>

        <div className="mt-8 rounded-[16px] border border-line bg-purple-50/60 p-5">
          <div className="flex gap-3">
            <AlertCircle className="mt-0.5 shrink-0 text-primary" width={18} height={18} />
            <div>
              <p className="text-[14px] leading-relaxed text-ink-2">
                Para poder recibir el pago de tus transacciones, es necesario completar
                el registro de tu negocio.
              </p>
              <ul className="mt-3 space-y-1.5 text-[14px] text-ink-2">
                {["Información bancaria", "Información de tu negocio", "Información del representante legal"].map(
                  (t) => (
                    <li key={t} className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-ink-3" />
                      {t}
                    </li>
                  )
                )}
              </ul>
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

        {pending && (
          <div className="mt-4 rounded-[16px] bg-alert-bg p-4">
            <div className="mb-1 flex items-center gap-2 text-[14px] font-semibold text-alert">
              <AlertTriangle width={16} height={16} />
              Documentos corporativos pendientes
            </div>
            <p className="text-[13px] leading-relaxed text-ink-2">
              Como Persona Moral, deberás subir tu acta constitutiva y poder notarial
              desde el portal de documentos para operar sin restricciones.
            </p>
          </div>
        )}

        <div className="mt-8">
          <VelpayLogo />
        </div>
      </div>
    </SplitLayout>
  );
}

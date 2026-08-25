"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Check, Upload } from "./icons";

interface UploadDropzoneProps {
  onFile?: (name: string) => void;
}

/** Dashed drag-and-drop dropzone (upload-id screen). Simulated for the prototype. */
export function UploadDropzone({ onFile }: UploadDropzoneProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  function accept(name: string) {
    setFileName(name);
    onFile?.(name);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files?.[0];
        accept(f ? f.name : "documento.pdf");
      }}
      onClick={() => accept("identificacion.pdf")}
      role="button"
      tabIndex={0}
      className={cn(
        "focus-ring flex cursor-pointer flex-col items-center justify-center rounded-[16px] border-2 border-dashed px-6 py-12 text-center transition-colors",
        fileName
          ? "border-success bg-success-bg/40"
          : dragging
            ? "border-primary bg-purple-50"
            : "border-primary/50 bg-surface hover:bg-purple-50"
      )}
    >
      <span
        className={cn(
          "mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm",
          fileName ? "text-success" : "text-ink-2"
        )}
      >
        {fileName ? <Check width={24} height={24} /> : <Upload width={22} height={22} />}
      </span>
      {fileName ? (
        <>
          <p className="text-[15px] font-semibold text-success">Archivo cargado</p>
          <p className="mt-1 text-[13px] text-ink-3">{fileName}</p>
        </>
      ) : (
        <>
          <p className="text-[15px] font-semibold text-primary">Subir archivo</p>
          <p className="mt-1 text-[13px] text-ink-3">
            Arrastra y suelta tu archivo aquí o haz clic para buscar
          </p>
          <p className="text-[13px] text-ink-3">PDF, JPG o PNG (Máx. 10MB)</p>
        </>
      )}
    </div>
  );
}

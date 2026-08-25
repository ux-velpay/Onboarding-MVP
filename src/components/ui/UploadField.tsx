import { cn } from "@/lib/cn";
import { Check, FileUp } from "./icons";

interface UploadFieldProps {
  /** Placeholder / description text shown next to the icon. */
  text: string;
  buttonLabel?: string;
  uploaded?: boolean;
  count?: string;
  onUpload?: () => void;
}

/** The muted "gray box" upload row used on bank-data, TNP and info-adicional. */
export function UploadField({
  text,
  buttonLabel = "Subir",
  uploaded,
  count,
  onUpload,
}: UploadFieldProps) {
  return (
    <div className="flex items-center gap-3.5 rounded-[12px] bg-surface px-4 py-3.5">
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          uploaded ? "bg-success-bg text-success" : "bg-white text-ink-3"
        )}
      >
        {uploaded ? <Check width={17} height={17} /> : <FileUp width={17} height={17} />}
      </span>
      <p className="min-w-0 flex-1 text-[14px] leading-snug text-ink-3">{text}</p>
      {count && <span className="text-[13px] text-ink-3">{count}</span>}
      <button
        type="button"
        onClick={onUpload}
        className="focus-ring shrink-0 rounded-[9px] bg-primary-dark px-4 py-2 text-[14px] font-medium text-white transition-colors hover:bg-primary-hover"
      >
        {uploaded ? "Cargado" : buttonLabel}
      </button>
    </div>
  );
}

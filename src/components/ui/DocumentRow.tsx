import { cn } from "@/lib/cn";
import { Check, Lock } from "./icons";

interface DocumentRowProps {
  label: string;
  status: "done" | "pending";
  onUpload?: () => void;
}

export function DocumentRow({ label, status, onUpload }: DocumentRowProps) {
  const done = status === "done";
  return (
    <div
      className={cn(
        "flex items-center gap-3.5 rounded-[12px] px-4 py-3.5 transition-colors",
        done ? "bg-muted" : "border border-primary/60 bg-white"
      )}
    >
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
          done ? "bg-primary-dark text-white" : "bg-page text-ink-3"
        )}
      >
        {done ? <Check width={16} height={16} /> : <Lock width={15} height={15} />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-medium text-ink">{label}</p>
        <p className="text-[13px] text-ink-3">
          {done ? "Completados y validados" : "Pendiente de carga digital"}
        </p>
      </div>
      {done ? (
        <span className="text-[14px] font-medium text-success">Listo</span>
      ) : (
        <button
          type="button"
          onClick={onUpload}
          className="focus-ring rounded-[9px] bg-primary-dark px-4 py-2 text-[14px] font-medium text-white transition-colors hover:bg-primary-hover"
        >
          Subir
        </button>
      )}
    </div>
  );
}

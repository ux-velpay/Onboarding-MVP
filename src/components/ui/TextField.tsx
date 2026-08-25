import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface FieldShellProps {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
}

export function FieldShell({ label, hint, error, children }: FieldShellProps) {
  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-[14px] font-medium text-ink">{label}</span>
      )}
      {children}
      {error ? (
        <span className="mt-1.5 block text-[13px] text-danger">{error}</span>
      ) : hint ? (
        <span className="mt-1.5 block text-[13px] text-ink-3">{hint}</span>
      ) : null}
    </label>
  );
}

const inputBase =
  "focus-ring w-full rounded-[10px] border border-line bg-white px-4 text-[15px] text-ink placeholder:text-placeholder transition-colors";

interface TextFieldProps extends ComponentPropsWithoutRef<"input"> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
}

export function TextField({ label, hint, error, className, ...props }: TextFieldProps) {
  return (
    <FieldShell label={label} hint={hint} error={error}>
      <input
        className={cn(
          inputBase,
          "h-[52px]",
          error ? "border-danger" : undefined,
          className
        )}
        {...props}
      />
    </FieldShell>
  );
}

interface TextAreaProps extends ComponentPropsWithoutRef<"textarea"> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
}

export function TextArea({ label, hint, error, className, ...props }: TextAreaProps) {
  return (
    <FieldShell label={label} hint={hint} error={error}>
      <textarea
        className={cn(inputBase, "min-h-[52px] resize-none py-3.5 leading-normal", className)}
        rows={2}
        {...props}
      />
    </FieldShell>
  );
}

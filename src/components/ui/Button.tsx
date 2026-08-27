import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "link";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: Variant;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  // action.primary → purple 500
  primary:
    "bg-primary text-white hover:bg-primary-hover shadow-[0_1px_2px_rgba(45,0,109,0.25)]",
  // action.secondary → dark purple 700
  secondary: "bg-primary-dark text-white hover:bg-primary-hover",
  // tertiary → white w/ border
  ghost: "bg-white text-ink border border-line-strong hover:bg-page",
  // text link
  link: "bg-transparent text-primary hover:text-primary-hover px-0 py-0 h-auto font-medium",
};

export function Button({
  variant = "primary",
  fullWidth,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "focus-ring inline-flex items-center justify-center gap-2 rounded-[12px] px-6 text-[15px] font-medium leading-none transition-colors duration-200 disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-3 disabled:shadow-none",
        variant !== "link" && "h-[52px]",
        fullWidth && "w-full",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

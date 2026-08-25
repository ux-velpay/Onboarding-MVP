import type { ComponentType, SVGProps } from "react";
import { cn } from "@/lib/cn";

type Tone = "success" | "danger" | "alert" | "info" | "dark";

const tones: Record<Tone, string> = {
  success: "bg-success-bg text-success",
  danger: "bg-danger-bg text-danger",
  alert: "bg-alert-bg text-alert",
  info: "bg-purple-50 text-primary",
  dark: "bg-success-bg text-primary-dark",
};

interface IconBadgeProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  tone?: Tone;
  className?: string;
}

export function IconBadge({ icon: Icon, tone = "success", className }: IconBadgeProps) {
  return (
    <span
      className={cn(
        "flex h-[60px] w-[60px] items-center justify-center rounded-full",
        tones[tone],
        className
      )}
    >
      <Icon width={26} height={26} />
    </span>
  );
}

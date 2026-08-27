import type { ComponentType, ReactNode, SVGProps } from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "success" | "info";

const tones: Record<Tone, { box: string; title: string }> = {
  neutral: { box: "bg-surface", title: "text-primary-dark" },
  success: { box: "bg-success-bg border border-success/25", title: "text-success" },
  info: { box: "bg-purple-50", title: "text-primary-dark" },
};

interface InfoBoxProps {
  title?: ReactNode;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  tone?: Tone;
  children: ReactNode;
  className?: string;
}

export function InfoBox({ title, icon: Icon, tone = "neutral", children, className }: InfoBoxProps) {
  const t = tones[tone];
  return (
    <div className={cn("rounded-[12px] p-4", t.box, className)}>
      {title && (
        <div className={cn("mb-1.5 flex items-center gap-2 text-[15px] font-medium", t.title)}>
          {Icon && <Icon width={18} height={18} />}
          <span>{title}</span>
        </div>
      )}
      <div className="text-[14px] leading-relaxed text-ink-2">{children}</div>
    </div>
  );
}

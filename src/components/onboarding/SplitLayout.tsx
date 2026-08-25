import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { GradientPanel } from "./GradientPanel";

interface SplitLayoutProps {
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  /** Align main content vertically. Forms use "center"; nothing else needed. */
  align?: "center" | "start";
}

export function SplitLayout({ header, footer, children, align = "center" }: SplitLayoutProps) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left — content column */}
      <div className="flex w-full flex-col px-6 py-8 sm:px-12 lg:w-1/2 lg:px-[72px] lg:py-10">
        <div className="mx-auto flex w-full max-w-[600px] flex-1 flex-col">
          {header && <div className="shrink-0">{header}</div>}
          <div
            className={cn(
              "flex flex-1 flex-col py-8",
              align === "center" ? "justify-center" : "justify-start"
            )}
          >
            <div className="animate-step">{children}</div>
          </div>
          {footer && <div className="shrink-0">{footer}</div>}
        </div>
      </div>
      {/* Right — brand gradient */}
      <GradientPanel />
    </div>
  );
}

import type { ReactNode } from "react";
import { VelpayLogo } from "@/components/ui/VelpayLogo";

interface CenteredLayoutProps {
  children: ReactNode;
}

/** Centered white card on a muted page — used for terminal states (blocked). */
export function CenteredLayout({ children }: CenteredLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-6 py-12">
      <div className="animate-step w-full max-w-[520px] rounded-[20px] border border-line bg-white px-8 py-10 text-center shadow-[var(--shadow-md)] sm:px-12">
        <div className="mb-8 flex justify-center">
          <VelpayLogo />
        </div>
        {children}
      </div>
    </div>
  );
}

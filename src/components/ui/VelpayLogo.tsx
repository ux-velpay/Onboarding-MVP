import { cn } from "@/lib/cn";

interface VelpayLogoProps {
  className?: string;
  withMark?: boolean;
}

/** VelPay wordmark. Uses a small brand mark + "Velpay" set in the brand purple. */
export function VelpayLogo({ className, withMark = true }: VelpayLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2 select-none", className)}>
      {withMark && (
        <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
          <path
            d="M3 4.5 9 17.5 15 4.5"
            fill="none"
            stroke="#2d006d"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="17.5" cy="6" r="2.4" fill="#12b3b3" />
        </svg>
      )}
      <span className="text-[20px] font-bold tracking-tight text-primary-dark">
        Velpay
      </span>
    </span>
  );
}

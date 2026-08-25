import { cn } from "@/lib/cn";

interface ProgressDotsProps {
  current: number; // 1-based
  total: number;
}

export function ProgressDots({ current, total }: ProgressDotsProps) {
  return (
    <div className="flex items-center gap-2" aria-label={`Paso ${current} de ${total}`}>
      {Array.from({ length: total }).map((_, i) => {
        const n = i + 1;
        const isCurrent = n === current;
        const isDone = n < current;
        return (
          <span
            key={n}
            className={cn(
              "h-[7px] rounded-full transition-all duration-200",
              isCurrent ? "w-6 bg-primary-dark" : "w-[7px]",
              isDone && "bg-primary-dark",
              !isCurrent && !isDone && "bg-purple-200"
            )}
          />
        );
      })}
    </div>
  );
}

import { cn } from "@/lib/utils";

export function ScenarioProgress({
  total,
  current,
  className,
}: {
  total: number;
  current: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1.5", className)} role="group" aria-label="Szituáció előrehaladása">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className={cn(
            "h-[3px] flex-1 transition-colors duration-500",
            i < current ? "bg-primary" : i === current ? "bg-primary/50" : "bg-muted"
          )}
        />
      ))}
      <span className="sr-only">
        {current + 1}. lépés a(z) {total}-ból
      </span>
      <span className="ml-2 shrink-0 font-mono text-xs tabular-nums text-muted-foreground" aria-hidden="true">
        {current + 1} / {total}
      </span>
    </div>
  );
}

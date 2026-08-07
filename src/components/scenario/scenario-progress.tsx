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
            "h-1.5 flex-1 rounded-full transition-colors duration-500",
            i < current ? "bg-primary" : i === current ? "bg-primary/50" : "bg-muted"
          )}
        />
      ))}
      <span className="sr-only">
        {current + 1}. lépés a(z) {total}-ból
      </span>
      <span className="ml-2 shrink-0 text-xs font-medium tabular-nums text-muted-foreground" aria-hidden="true">
        {current + 1} / {total}
      </span>
    </div>
  );
}

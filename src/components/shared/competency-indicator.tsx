import { COMPETENCIES } from "@/lib/data/meta";
import type { CompetencyKey } from "@/lib/types";
import { cn } from "@/lib/utils";

function levelLabel(value: number) {
  if (value >= 80) return "Erős";
  if (value >= 60) return "Fejlődő";
  return "Gyakorlást igényel";
}

export function CompetencyIndicator({
  competency,
  value,
  className,
}: {
  competency: CompetencyKey;
  value: number;
  className?: string;
}) {
  const meta = COMPETENCIES[competency];
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm text-foreground/90">{meta.label}</span>
        <span className="text-sm font-semibold tabular-nums text-foreground">
          {value}%
          <span className="sr-only"> – {levelLabel(value)}</span>
        </span>
      </div>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={meta.label}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            value >= 80 ? "bg-success" : value >= 60 ? "bg-primary" : "bg-warning"
          )}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

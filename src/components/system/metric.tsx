import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Metric({
  icon: Icon,
  label,
  value,
  hint,
  className,
  tone = "default",
}: {
  icon?: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  className?: string;
  tone?: "default" | "accent";
}) {
  return (
    <div className={cn("flex items-start gap-2.5", className)}>
      {Icon && (
        <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", tone === "accent" ? "text-primary" : "text-muted-foreground")} aria-hidden="true" />
      )}
      <div className="min-w-0">
        <p className="type-label">{label}</p>
        <p className="type-metric text-2xl leading-tight text-foreground">{value}</p>
        {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}

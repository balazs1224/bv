import { TrendingUp, TrendingDown } from "lucide-react";
import type { InstructorKpi } from "@/lib/data/instructor";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function KpiCard({ kpi }: { kpi: InstructorKpi }) {
  return (
    <Card className="border-border/80 bg-card">
      <CardContent className="space-y-2 px-5 py-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{kpi.label}</p>
        <p className="text-2xl font-semibold text-foreground">{kpi.value}</p>
        {kpi.delta && (
          <p
            className={cn(
              "inline-flex items-center gap-1 text-xs font-medium",
              kpi.trend === "up" ? "text-success" : kpi.trend === "down" ? "text-warning" : "text-muted-foreground"
            )}
          >
            {kpi.trend === "up" && <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />}
            {kpi.trend === "down" && <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />}
            {kpi.delta}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

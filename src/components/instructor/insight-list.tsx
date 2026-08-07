import { TriangleAlert, CircleCheck, Info } from "lucide-react";
import type { InsightItem } from "@/lib/data/instructor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const TONE_META: Record<InsightItem["tone"], { icon: typeof Info; className: string }> = {
  warning: { icon: TriangleAlert, className: "text-warning border-warning/30 bg-warning/10" },
  positive: { icon: CircleCheck, className: "text-success border-success/30 bg-success/10" },
  info: { icon: Info, className: "text-primary border-primary/30 bg-primary/10" },
};

export function InsightList({ insights }: { insights: InsightItem[] }) {
  return (
    <Card className="border-border/80 bg-card">
      <CardHeader>
        <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Automatikus insightok
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {insights.map((insight) => {
          const meta = TONE_META[insight.tone];
          const Icon = meta.icon;
          return (
            <div key={insight.id} className={cn("flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-sm", meta.className)}>
              <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <p className="leading-relaxed text-foreground/90">{insight.text}</p>
            </div>
          );
        })}
        <p className="pt-1 text-[11px] leading-relaxed text-muted-foreground">
          Szabályalapú, szimulált elemzés demonstrációs adatokon – az éles rendszerben ez a tényleges tanulói
          döntésnaplókból számolódna.
        </p>
      </CardContent>
    </Card>
  );
}

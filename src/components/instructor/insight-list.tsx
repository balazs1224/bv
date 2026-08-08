import { TriangleAlert, CircleCheck, Info } from "lucide-react";
import { INSIGHT_CATEGORY_LABEL, type InsightItem } from "@/lib/data/instructor";

const TONE_META: Record<InsightItem["tone"], { icon: typeof Info; textClass: string; borderClass: string }> = {
  warning: { icon: TriangleAlert, textClass: "text-warning", borderClass: "border-warning/50" },
  positive: { icon: CircleCheck, textClass: "text-success", borderClass: "border-success/50" },
  info: { icon: Info, textClass: "text-primary", borderClass: "border-primary/50" },
};

export function InsightList({ insights }: { insights: InsightItem[] }) {
  return (
    <div className="border border-hairline bg-surface p-6">
      <p className="type-eyebrow mb-4">Fejlődési trend és insightok</p>
      <div className="space-y-4">
        {insights.map((insight) => {
          const meta = TONE_META[insight.tone];
          const Icon = meta.icon;
          return (
            <div key={insight.id} className={`flex items-start gap-2.5 border-l-2 pl-4 ${meta.borderClass}`}>
              <Icon className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${meta.textClass}`} aria-hidden="true" />
              <div className="space-y-0.5">
                <p className={`font-mono text-[10px] font-medium uppercase tracking-wide ${meta.textClass}`}>
                  {INSIGHT_CATEGORY_LABEL[insight.category]}
                </p>
                <p className="text-[13px] leading-relaxed text-foreground/85">{insight.text}</p>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-5 border-t border-hairline pt-4 text-[11px] leading-relaxed text-muted-foreground">
        Szabályalapú, szimulált elemzés demonstrációs adatokon – az éles rendszerben ez a tényleges tanulói
        döntésnaplókból számolódna.
      </p>
    </div>
  );
}

import { INSIGHT_CATEGORY_LABEL, type InsightItem } from "@/lib/data/instructor";

export function HeroInsight({ insight }: { insight: InsightItem }) {
  const match = insight.text.match(/\d+/);
  const stat = match ? match[0] : "";

  return (
    <div className="border border-hairline bg-surface px-6 py-10 sm:px-10 sm:py-12">
      <p className="type-eyebrow mb-3 text-warning">
        Kiemelt megfigyelés · {INSIGHT_CATEGORY_LABEL[insight.category]}
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-6">
        {stat && <p className="font-display text-6xl leading-none text-foreground sm:text-7xl">{stat}%</p>}
        <p className="max-w-xl text-[15px] leading-relaxed text-foreground/85">{insight.text}</p>
      </div>
    </div>
  );
}

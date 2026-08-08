import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CompetencyKey } from "@/lib/types";
import { recommendFromLevels } from "@/lib/adaptive-recommendation";
import { cn } from "@/lib/utils";

export function AdaptiveRecommendation({
  levels,
  className,
}: {
  levels: Record<CompetencyKey, number>;
  className?: string;
}) {
  const recommendation = recommendFromLevels(levels);

  return (
    <div className={cn("border border-hairline bg-surface p-6", className)}>
      <p className="type-eyebrow mb-3">Személyre szabott gyakorlás</p>

      <div className="space-y-4 border-l-2 border-primary/60 pl-4">
        <p className="text-[13px] leading-relaxed text-foreground/85">{recommendation.reason}</p>
        <Link
          href="/mikrotanulas"
          className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary"
        >
          {recommendation.moduleTitle}
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>

      <p className="mt-5 text-[11px] leading-relaxed text-muted-foreground">
        Az eredményeid alapján, szabályalapú logikával számított ajánlás — nem gépi tanulási modell.
      </p>
    </div>
  );
}

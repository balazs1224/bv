import Link from "next/link";
import { Trophy, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import type { CompetencyKey, Scenario } from "@/lib/types";
import { COMPETENCIES } from "@/lib/data/meta";
import { formatSigned } from "@/lib/scenario-engine";
import { cn } from "@/lib/utils";

export function ResultScreen({
  scenario,
  scorePercent,
  goodCount,
  totalCount,
  xpTotal,
  competencyDeltas,
}: {
  scenario: Scenario;
  scorePercent: number;
  goodCount: number;
  totalCount: number;
  xpTotal: number;
  competencyDeltas: Partial<Record<CompetencyKey, number>>;
}) {
  const deltaEntries = Object.entries(competencyDeltas) as [CompetencyKey, number][];

  return (
    <div className="flex h-full flex-col justify-between gap-8 border border-hairline bg-surface p-6 sm:p-8">
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-6">
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5 text-success" aria-hidden="true" />
            <div>
              <p className="type-eyebrow">Szituáció teljesítve</p>
              <p className="font-display text-3xl leading-none text-foreground">{scorePercent}%</p>
            </div>
          </div>
          <div className="flex items-center gap-5 font-mono text-[12px] tabular-nums">
            <span className="text-muted-foreground">
              Helyes döntések <span className="text-foreground">{goodCount}/{totalCount}</span>
            </span>
            <span className="text-primary">{formatSigned(xpTotal)} XP</span>
          </div>
        </div>

        {deltaEntries.length > 0 && (
          <div className="space-y-2.5">
            <p className="type-label">Fejlődött</p>
            <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
              {deltaEntries.map(([key, delta]) => (
                <div key={key} className="flex items-center justify-between border-b border-hairline py-1.5">
                  <span className="text-[13.5px] text-foreground/85">{COMPETENCIES[key].label}</span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 font-mono text-[12px] tabular-nums",
                      delta >= 0 ? "text-success" : "text-critical"
                    )}
                  >
                    {delta >= 0 ? <TrendingUp className="h-3 w-3" aria-hidden="true" /> : <TrendingDown className="h-3 w-3" aria-hidden="true" />}
                    {formatSigned(delta)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          {scenario.strengths && (
            <div className="space-y-1.5 border-l-2 border-success/50 pl-4">
              <p className="type-label text-success/90">Erősséged</p>
              <p className="text-[13.5px] leading-relaxed text-foreground/85">{scenario.strengths}</p>
            </div>
          )}
          {scenario.growthArea && (
            <div className="space-y-1.5 border-l-2 border-warning/50 pl-4">
              <p className="type-label text-warning/90">Fejlesztendő terület</p>
              <p className="text-[13.5px] leading-relaxed text-foreground/85">{scenario.growthArea}</p>
            </div>
          )}
        </div>

        {scenario.nextModule && (
          <div className="flex items-center justify-between gap-4 border-t border-hairline pt-5">
            <div>
              <p className="type-label mb-1">Következő ajánlott modul</p>
              <p className="text-[14px] text-foreground/90">{scenario.nextModule}</p>
            </div>
            <Link
              href="/kepzesek"
              className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary"
            >
              Megnyitás
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Vezérlőpultra
        </Link>
        <Link
          href="/kepzesek"
          className="inline-flex items-center gap-2 border border-hairline px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-foreground/85 transition-colors hover:border-primary/40"
        >
          Képzési modulok
        </Link>
      </div>
    </div>
  );
}

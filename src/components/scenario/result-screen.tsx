import Link from "next/link";
import { CheckCircle2, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import type { CompetencyKey, RiskDimensionKey, RiskLevel, Scenario } from "@/lib/types";
import { COMPETENCIES, RISK_DIMENSIONS, RISK_DIMENSION_ORDER } from "@/lib/data/meta";
import { QUALITY_META, formatSigned, getRemainingRisk, scoreToQuality } from "@/lib/scenario-engine";
import { recommendFromDeltas } from "@/lib/adaptive-recommendation";
import { cn } from "@/lib/utils";

const TONE_TEXT: Record<string, string> = {
  success: "text-success",
  primary: "text-primary",
  warning: "text-warning",
  critical: "text-critical",
};

const LEVEL_INDEX: Record<RiskLevel, number> = { alacsony: 1, kozepes: 2, magas: 3 };

export function ResultScreen({
  scenario,
  scorePercent,
  goodCount,
  totalCount,
  xpTotal,
  competencyDeltas,
  finalRisk,
}: {
  scenario: Scenario;
  scorePercent: number;
  goodCount: number;
  totalCount: number;
  xpTotal: number;
  competencyDeltas: Partial<Record<CompetencyKey, number>>;
  finalRisk: Record<RiskDimensionKey, RiskLevel>;
}) {
  const deltaEntries = Object.entries(competencyDeltas) as [CompetencyKey, number][];
  const quality = scoreToQuality(scorePercent);
  const qualityMeta = QUALITY_META[quality];
  const [primaryCompetency] = scenario.competencies;

  const reducedCount = RISK_DIMENSION_ORDER.filter(
    (key) => LEVEL_INDEX[finalRisk[key]] < LEVEL_INDEX[scenario.initialRisk[key]]
  ).length;
  const remainingRisk = getRemainingRisk(finalRisk);

  const recommendation = recommendFromDeltas(
    competencyDeltas,
    scenario.nextModule ?? "Dinamikus kockázatértékelés"
  );

  return (
    <div className="flex h-full flex-col justify-between gap-8 border border-hairline bg-surface p-6 sm:p-8">
      <div className="space-y-8">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-hairline pb-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-success" aria-hidden="true" />
            <div>
              <p className="type-eyebrow">Szituáció lezárva</p>
              <p className={cn("text-xl font-semibold", TONE_TEXT[qualityMeta.tone])}>
                Döntési minőség: {qualityMeta.label}
              </p>
            </div>
          </div>
          <div className="text-right font-mono text-[12px] tabular-nums">
            <p className="text-muted-foreground">
              {goodCount}/{totalCount} jó döntés · {scorePercent}%
            </p>
            <p className="text-primary">{formatSigned(xpTotal)} XP</p>
          </div>
        </div>

        <div className="space-y-2.5">
          <p className="type-label">Kockázatkezelés</p>
          <p className="text-[13.5px] leading-relaxed text-foreground/85">
            {reducedCount > 0
              ? `A döntéseid ${reducedCount} kockázati dimenziót mérsékeltek a kiinduló állapothoz képest.`
              : "A döntéseid nem csökkentették érdemben a kiinduló kockázati szintet."}
          </p>
          {remainingRisk.length > 0 ? (
            <ul className="flex flex-wrap gap-2 pt-1">
              {remainingRisk.map((key) => (
                <li
                  key={key}
                  className="border border-warning/30 bg-warning/[0.06] px-2.5 py-1 text-[11px] text-warning"
                >
                  {RISK_DIMENSIONS[key].label}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[12.5px] text-success">A szituáció végére nincs kiemelt kockázati dimenzió.</p>
          )}
        </div>

        {deltaEntries.length > 0 && (
          <div className="space-y-2.5">
            <p className="type-label">Kompetenciahatás</p>
            <p className="text-[12px] leading-relaxed text-muted-foreground">
              Elsődleges fejlesztett kompetencia ebben a szituációban:{" "}
              <span className="text-foreground/80">{COMPETENCIES[primaryCompetency].label}</span>
            </p>
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

        <div className="flex items-center justify-between gap-4 border-t border-hairline pt-5">
          <div className="min-w-0">
            <p className="type-label mb-1">Következő ajánlott gyakorlat</p>
            <p className="text-[14px] text-foreground/90">{recommendation.moduleTitle}</p>
            <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{recommendation.reason}</p>
          </div>
          <Link
            href="/kepzesek"
            className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary"
          >
            Megnyitás
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
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

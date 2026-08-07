import Link from "next/link";
import { Trophy, Zap, TrendingUp, TrendingDown, Sparkles, ArrowRight } from "lucide-react";
import type { CompetencyKey, Scenario } from "@/lib/types";
import { COMPETENCIES } from "@/lib/data/meta";
import { formatSigned } from "@/lib/scenario-engine";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    <div className="space-y-6">
      <Card className="overflow-hidden border-primary/25 bg-gradient-to-br from-accent/70 to-card">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-success/40 bg-success/15 text-success">
            <Trophy className="h-7 w-7" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-success">Szituáció teljesítve</p>
            <p className="mt-1 text-4xl font-semibold tabular-nums text-foreground">{scorePercent}%</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-sm text-secondary-foreground">
              Helyes döntések: <strong className="font-semibold text-foreground">{goodCount} / {totalCount}</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
              <Zap className="h-4 w-4" aria-hidden="true" />
              {formatSigned(xpTotal)} XP
            </span>
          </div>
        </CardContent>
      </Card>

      {deltaEntries.length > 0 && (
        <Card className="border-border/80 bg-card">
          <CardContent className="space-y-3 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Fejlődött</p>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {deltaEntries.map(([key, delta]) => (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-3.5 py-2.5"
                >
                  <span className="text-sm text-foreground/90">{COMPETENCIES[key].label}</span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-sm font-semibold tabular-nums",
                      delta >= 0 ? "text-success" : "text-critical"
                    )}
                  >
                    {delta >= 0 ? (
                      <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                    {formatSigned(delta)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {scenario.strengths && (
          <Card className="border-success/25 bg-success/5">
            <CardContent className="space-y-1.5 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-success">Erősséged</p>
              <p className="text-sm leading-relaxed text-foreground/90">{scenario.strengths}</p>
            </CardContent>
          </Card>
        )}
        {scenario.growthArea && (
          <Card className="border-warning/25 bg-warning/5">
            <CardContent className="space-y-1.5 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-warning">Fejlesztendő terület</p>
              <p className="text-sm leading-relaxed text-foreground/90">{scenario.growthArea}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {scenario.nextModule && (
        <Card className="border-primary/25 bg-card">
          <CardContent className="flex flex-col items-start justify-between gap-3 p-5 sm:flex-row sm:items-center">
            <div className="flex items-start gap-2.5">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Következő ajánlott modul</p>
                <p className="text-sm text-foreground/90">{scenario.nextModule}</p>
              </div>
            </div>
            <Button render={<Link href="/kepzesek" />} nativeButton={false} variant="secondary" size="sm" className="shrink-0 gap-1.5">
              Megnyitás
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-3">
        <Button render={<Link href="/" />} nativeButton={false} size="lg">
          Vissza a vezérlőpultra
        </Button>
        <Button render={<Link href="/kepzesek" />} nativeButton={false} variant="outline" size="lg">
          Képzési modulok
        </Button>
      </div>
    </div>
  );
}

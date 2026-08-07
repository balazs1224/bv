import { Flame, Clock, Target, ArrowRight } from "lucide-react";
import Link from "next/link";
import { LEARNER } from "@/lib/data/learner";
import { ESET_07, OTHER_SCENARIOS } from "@/lib/data/scenarios";
import { COMPETENCY_ORDER } from "@/lib/data/meta";
import { StatCard } from "@/components/dashboard/stat-card";
import { TodayScenarioHero, ScenarioListCard } from "@/components/dashboard/scenario-cards";
import { CompetencyRadar } from "@/components/dashboard/competency-radar";
import { CompetencyIndicator } from "@/components/shared/competency-indicator";
import { AdaptiveRecommendation } from "@/components/shared/adaptive-recommendation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Jó szolgálatot, {LEARNER.name}!
          </h1>
          <p className="text-sm text-muted-foreground">
            {LEARNER.level} – {LEARNER.levelNumber === 2 ? "II." : `${LEARNER.levelNumber}.`} szint ·{" "}
            {LEARNER.xp.toLocaleString("hu-HU")} / {LEARNER.xpToNextLevel.toLocaleString("hu-HU")} XP a következő szintig
          </p>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-full border border-warning/30 bg-warning/10 px-3.5 py-1.5 text-sm font-medium text-warning sm:self-auto">
          <Flame className="h-4 w-4" aria-hidden="true" />
          {LEARNER.streakDays} napos sorozat
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Target} label="Teljesítés" value={`${LEARNER.completionRate}%`} hint="Teljes képzési anyag" />
        <StatCard icon={Clock} label="Képzési idő" value={LEARNER.trainingTimeLabel} hint="Az elmúlt 30 napban" />
        <StatCard icon={Flame} label="Aktuális sorozat" value={`${LEARNER.streakDays} nap`} hint="Egymást követő aktív nap" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section aria-labelledby="mai-szituacio">
            <h2 id="mai-szituacio" className="sr-only">
              Mai szituáció
            </h2>
            <TodayScenarioHero scenario={ESET_07} />
          </section>

          <section aria-labelledby="tovabbi-szituaciok">
            <div className="mb-3 flex items-center justify-between">
              <h2 id="tovabbi-szituaciok" className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                További szituációk
              </h2>
              <Link href="/kepzesek" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                Összes képzés
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {OTHER_SCENARIOS.map((s) => (
                <ScenarioListCard key={s.id} scenario={s} />
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <Card className="border-border/80 bg-card">
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Kompetenciaprofil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <CompetencyRadar values={LEARNER.competencies} />
              <div className="space-y-3.5 border-t border-border/70 pt-4">
                {COMPETENCY_ORDER.map((key) => (
                  <CompetencyIndicator key={key} competency={key} value={LEARNER.competencies[key]} />
                ))}
              </div>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                A kompetenciaszintek a szituációkban hozott döntések alapján, folyamatosan frissülnek.
              </p>
            </CardContent>
          </Card>

          <AdaptiveRecommendation />
        </div>
      </div>

      <Card className="border-dashed border-border/80 bg-transparent">
        <CardContent className="flex flex-col items-start justify-between gap-4 p-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-foreground">Bemutatnád a platformot a bíráló bizottságnak?</p>
            <p className="text-xs text-muted-foreground">
              Indítsd el a vezetett pályázati bemutatót – kb. 5 perc, előre összeállított útvonalon.
            </p>
          </div>
          <Button render={<Link href="/demo" />} nativeButton={false} variant="outline">
            Pályázati demo indítása
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

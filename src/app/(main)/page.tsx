import { Flame, Clock, Target, ArrowRight, Presentation } from "lucide-react";
import Link from "next/link";
import { LEARNER } from "@/lib/data/learner";
import { ESET_07, OTHER_SCENARIOS } from "@/lib/data/scenarios";
import { MissionBrief } from "@/components/dashboard/mission-brief";
import { StatusStrip } from "@/components/dashboard/status-strip";
import { SituationRow } from "@/components/dashboard/situation-row";
import { CompetencyModule } from "@/components/dashboard/competency-module";
import { AdaptiveRecommendation } from "@/components/shared/adaptive-recommendation";
import { Section } from "@/components/system/section";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div>
          <p className="type-eyebrow mb-1">Szolgálati áttekintés</p>
          <h1 className="text-2xl font-semibold text-foreground">Jó szolgálatot, {LEARNER.name}!</h1>
        </div>
        <p className="flex items-center gap-4 pb-0.5 text-xs text-muted-foreground">
          <span>
            {LEARNER.level} · {LEARNER.levelNumber === 2 ? "II." : `${LEARNER.levelNumber}.`} szint
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Flame className="h-3.5 w-3.5 text-warning" aria-hidden="true" />
            {LEARNER.streakDays} napos sorozat
          </span>
        </p>
      </div>

      <MissionBrief scenario={ESET_07} />

      <StatusStrip
        items={[
          { icon: Target, label: "Teljesítés", value: `${LEARNER.completionRate}%`, hint: "Teljes képzési anyag" },
          { icon: Clock, label: "Képzési idő", value: LEARNER.trainingTimeLabel, hint: "Elmúlt 30 nap" },
          { icon: Flame, label: "Sorozat", value: `${LEARNER.streakDays} nap`, hint: "Egymást követő aktív nap" },
        ]}
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.6fr_1fr]">
        <Section
          eyebrow="Gyakorlótár"
          title="További szituációk"
          action={
            <Link href="/kepzesek" className="inline-flex items-center gap-1 text-xs font-medium text-primary">
              Összes képzés
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          }
        >
          <ul className="divide-y divide-hairline border-y border-hairline">
            {OTHER_SCENARIOS.map((s) => (
              <SituationRow key={s.id} scenario={s} />
            ))}
          </ul>
        </Section>

        <div className="space-y-6">
          <CompetencyModule values={LEARNER.competencies} />
          <AdaptiveRecommendation />
        </div>
      </div>

      <div className="flex flex-col items-start justify-between gap-3 border-t border-hairline pt-6 sm:flex-row sm:items-center">
        <p className="text-[13px] text-muted-foreground">
          Bemutatnád a platformot a bíráló bizottságnak? Vezetett, kb. 5 perces pályázati bemutató.
        </p>
        <Link
          href="/demo"
          className="inline-flex shrink-0 items-center gap-2 border border-hairline px-4 py-2 text-xs font-semibold uppercase tracking-wide text-foreground/85 transition-colors hover:border-primary/40 hover:text-foreground"
        >
          <Presentation className="h-3.5 w-3.5" aria-hidden="true" />
          Pályázati demo
        </Link>
      </div>
    </div>
  );
}

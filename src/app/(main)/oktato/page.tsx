import Link from "next/link";
import { Users, CheckCircle2, Gauge, FileEdit, ArrowRight } from "lucide-react";
import { INSTRUCTOR_INSIGHTS } from "@/lib/data/instructor";
import { HeroInsight } from "@/components/instructor/hero-insight";
import { StatusStrip } from "@/components/dashboard/status-strip";
import { CompetencyRiskList } from "@/components/instructor/competency-risk-list";
import { InsightList } from "@/components/instructor/insight-list";
import { CompetencyHeatmap } from "@/components/instructor/competency-heatmap";
import { GroupComparisonChart } from "@/components/instructor/group-comparison-chart";
import { ScenarioResultsTable } from "@/components/instructor/scenario-results-table";

export default function OktatoPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div>
          <p className="type-eyebrow mb-1">Oktatói áttekintés</p>
          <h1 className="text-2xl font-semibold text-foreground">Hol van képzési kockázat az állományban?</h1>
        </div>
        <Link
          href="/oktato/szerkeszto"
          className="inline-flex items-center gap-2 border border-hairline px-4 py-2 text-xs font-semibold uppercase tracking-wide text-foreground/85 transition-colors hover:border-primary/40"
        >
          <FileEdit className="h-3.5 w-3.5" aria-hidden="true" />
          Szituációszerkesztő
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      <HeroInsight insight={INSTRUCTOR_INSIGHTS[0]} />

      <StatusStrip
        items={[
          { icon: Users, label: "Aktív tanulók", value: "184", hint: "+12 az elmúlt hónapban" },
          { icon: CheckCircle2, label: "Befejezési arány", value: "68%", hint: "+5% az előző ciklushoz képest" },
          { icon: Gauge, label: "Átlagos kompetenciaszint", value: "74%", hint: "+3% az elmúlt 30 napban" },
        ]}
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr]">
        <CompetencyRiskList />
        <InsightList insights={INSTRUCTOR_INSIGHTS.slice(1)} />
      </div>

      <GroupComparisonChart />

      <CompetencyHeatmap />

      <ScenarioResultsTable />
    </div>
  );
}

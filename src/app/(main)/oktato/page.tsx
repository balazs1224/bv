import Link from "next/link";
import { FileEdit, ArrowRight } from "lucide-react";
import { INSTRUCTOR_KPIS, INSTRUCTOR_INSIGHTS } from "@/lib/data/instructor";
import { KpiCard } from "@/components/instructor/kpi-card";
import { InsightList } from "@/components/instructor/insight-list";
import { CompetencyHeatmap } from "@/components/instructor/competency-heatmap";
import { GroupComparisonChart } from "@/components/instructor/group-comparison-chart";
import { ScenarioResultsTable } from "@/components/instructor/scenario-results-table";
import { Button } from "@/components/ui/button";

export default function OktatoPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Oktatói áttekintés</h1>
          <p className="text-sm text-muted-foreground">
            Az állomány képzési haladása, kompetenciaszintjei és a szituációk teljesítési adatai.
          </p>
        </div>
        <Button render={<Link href="/oktato/szerkeszto" />} nativeButton={false} variant="outline" className="gap-2 self-start sm:self-auto">
          <FileEdit className="h-4 w-4" aria-hidden="true" />
          Szituációszerkesztő
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {INSTRUCTOR_KPIS.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <GroupComparisonChart />
        </div>
        <div className="lg:col-span-2">
          <InsightList insights={INSTRUCTOR_INSIGHTS} />
        </div>
      </div>

      <CompetencyHeatmap />

      <ScenarioResultsTable />
    </div>
  );
}

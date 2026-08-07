import Link from "next/link";
import { Clock, ListChecks, Layers, ShieldAlert, ArrowRight } from "lucide-react";
import { TRAINING_MODULES } from "@/lib/data/modules";
import { MUVELET_KRITIKUS_PONT } from "@/lib/data/scenarios";
import { ModuleCard } from "@/components/modules/module-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DifficultyBadge } from "@/components/shared/difficulty-badge";

export default function KepzesekPage() {
  const regular = TRAINING_MODULES.filter((m) => m.status !== "zarolt");
  const finalModule = TRAINING_MODULES.find((m) => m.status === "zarolt");
  const scenario = MUVELET_KRITIKUS_PONT;

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Képzések</h1>
        <p className="text-sm text-muted-foreground">
          A szituációalapú képzési sor kilenc modulból épül fel, a helyzetfelismeréstől a záró komplex gyakorlatig.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {regular.map((m) => (
          <ModuleCard key={m.id} module={m} />
        ))}
      </div>

      {finalModule && (
        <Card className="overflow-hidden border-critical/25 bg-gradient-to-br from-critical/10 via-card to-card">
          <CardContent className="flex flex-col gap-5 p-6 sm:p-7">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-critical/30 bg-critical/10 px-3 py-1 text-xs font-semibold text-critical">
                <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
                {finalModule.index} · Záró szituáció
              </span>
              <DifficultyBadge difficulty={scenario.difficulty} />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground sm:text-2xl">{scenario.title}</h2>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{scenario.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary/60 px-2 py-1 text-xs text-secondary-foreground">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                Idő: {scenario.estimatedTime}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary/60 px-2 py-1 text-xs text-secondary-foreground">
                <ListChecks className="h-3.5 w-3.5" aria-hidden="true" />
                Döntési pont: {scenario.decisionPoints}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary/60 px-2 py-1 text-xs text-secondary-foreground">
                <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                Kompetencia: {scenario.competencies.length}
              </span>
            </div>

            <div>
              <Button render={<Link href={`/szituacio/${scenario.id}`} />} nativeButton={false} size="lg" className="gap-2">
                Záró szituáció indítása
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

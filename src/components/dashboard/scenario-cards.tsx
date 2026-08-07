import Link from "next/link";
import { Clock, Layers, MapPin, ArrowRight } from "lucide-react";
import type { Scenario } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DifficultyBadge } from "@/components/shared/difficulty-badge";
import { CorridorIllustration } from "@/components/shared/corridor-illustration";

export function TodayScenarioHero({ scenario }: { scenario: Scenario }) {
  return (
    <Card className="overflow-hidden border-border/80 bg-card p-0">
      <div className="grid md:grid-cols-[1.1fr_1.6fr]">
        <div className="relative hidden min-h-[220px] md:block">
          <CorridorIllustration className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent md:bg-gradient-to-r" />
          <div className="absolute left-5 top-5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/40 bg-warning/15 px-3 py-1 text-xs font-semibold text-warning">
              <span className="h-1.5 w-1.5 rounded-full bg-warning" aria-hidden="true" />
              Mai szituáció
            </span>
          </div>
        </div>

        <CardContent className="flex flex-col gap-5 p-6 md:p-7">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
              <span className="rounded border border-border px-1.5 py-0.5 font-mono tracking-wide text-foreground/80">
                {scenario.code}
              </span>
              <span aria-hidden="true">·</span>
              <span>{scenario.time}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                {scenario.location}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-balance text-foreground sm:text-2xl">{scenario.title}</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{scenario.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <DifficultyBadge difficulty={scenario.difficulty} />
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary/60 px-2 py-1 text-xs text-secondary-foreground">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              Várható idő: {scenario.estimatedTime}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary/60 px-2 py-1 text-xs text-secondary-foreground">
              <Layers className="h-3.5 w-3.5" aria-hidden="true" />
              Fejlesztett kompetenciák: {scenario.competencies.length}
            </span>
          </div>

          <div className="mt-auto pt-1">
            <Button render={<Link href={`/szituacio/${scenario.id}`} />} nativeButton={false} size="lg" className="gap-2">
              Szituáció indítása
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

export function ScenarioListCard({ scenario }: { scenario: Scenario }) {
  return (
    <Card className="group flex h-full flex-col border-border/80 bg-card transition-colors hover:border-primary/40">
      <CardContent className="flex h-full flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2 text-xs font-medium text-muted-foreground">
          <span className="rounded border border-border px-1.5 py-0.5 font-mono text-foreground/80">{scenario.code}</span>
          <span>{scenario.time}</span>
        </div>
        <h3 className="text-sm font-semibold leading-snug text-foreground">{scenario.title}</h3>
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{scenario.description}</p>
        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
          <DifficultyBadge difficulty={scenario.difficulty} className="text-[11px]" />
          <span className="inline-flex items-center gap-1 rounded-md border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" aria-hidden="true" />
            {scenario.estimatedTime}
          </span>
        </div>
        <Button
          render={<Link href={`/szituacio/${scenario.id}`} />}
          nativeButton={false}
          variant="secondary"
          size="sm"
          className="mt-1 justify-between"
        >
          Indítás
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Button>
      </CardContent>
    </Card>
  );
}

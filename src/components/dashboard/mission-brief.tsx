import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Scenario } from "@/lib/types";
import { CorridorIllustration } from "@/components/shared/corridor-illustration";
import { StatusDot } from "@/components/system/panel";
import { cn } from "@/lib/utils";

const DIFFICULTY_LABEL: Record<Scenario["difficulty"], string> = {
  kezdo: "Kezdő",
  kozepes: "Közepes",
  halado: "Haladó",
};

const DIFFICULTY_TONE: Record<Scenario["difficulty"], "success" | "warning" | "critical"> = {
  kezdo: "success",
  kozepes: "warning",
  halado: "critical",
};

export function MissionBrief({ scenario }: { scenario: Scenario }) {
  return (
    <div className="border border-hairline bg-surface">
      <div className="grid lg:grid-cols-[1.15fr_1fr]">
        <div className="flex flex-col justify-between gap-8 px-6 py-8 sm:px-10 sm:py-10">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <StatusDot tone="warning" className="animate-pulse" />
              <p className="type-eyebrow">Mai gyakorlat</p>
            </div>

            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-sm tabular-nums text-muted-foreground">
              <span className="text-foreground">{scenario.time}</span>
              <span aria-hidden="true">/</span>
              <span>{scenario.code}</span>
              <span aria-hidden="true">/</span>
              <span className="uppercase tracking-wide">{scenario.location}</span>
            </div>

            <h1 className="font-display text-3xl leading-[1.1] text-balance text-foreground sm:text-4xl">
              {scenario.title}
            </h1>

            <p className="max-w-md text-[15px] leading-relaxed text-muted-foreground">{scenario.description}</p>

            <dl className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-sm">
              <div className="flex items-center gap-1.5">
                <StatusDot tone={DIFFICULTY_TONE[scenario.difficulty]} />
                <dt className="sr-only">Nehézség</dt>
                <dd className="text-foreground/85">{DIFFICULTY_LABEL[scenario.difficulty]}</dd>
              </div>
              <div>
                <dt className="sr-only">Várható idő</dt>
                <dd className="text-foreground/85">{scenario.estimatedTime}</dd>
              </div>
              <div>
                <dt className="sr-only">Fejlesztett kompetenciák</dt>
                <dd className="text-foreground/85">{scenario.competencies.length} fejlesztett kompetencia</dd>
              </div>
            </dl>
          </div>

          <Link
            href={`/szituacio/${scenario.id}`}
            className="group inline-flex w-fit items-center gap-2.5 bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Szituáció indítása
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="relative min-h-[260px] overflow-hidden border-t border-hairline lg:min-h-full lg:border-l lg:border-t-0">
          <CorridorIllustration className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface/70 via-transparent to-transparent lg:bg-gradient-to-r" />

          <div className="absolute left-4 top-4 space-y-1 font-mono text-[11px] tabular-nums text-white/70">
            <p>{scenario.time.replace(":", ":")}:00</p>
          </div>

          <div className={cn("absolute bottom-4 left-4 right-4 flex flex-wrap gap-x-5 gap-y-1")}>
            <MetaChip label="Érintett személyek" value="4" />
            <MetaChip label="Megfigyelési pont" value={String(scenario.stages.find((s) => s.type === "observation")?.observations?.length ?? "—")} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="leading-tight">
      <p className="text-[9.5px] font-medium uppercase tracking-[0.12em] text-white/50">{label}</p>
      <p className="font-mono text-sm tabular-nums text-white/85">{value}</p>
    </div>
  );
}

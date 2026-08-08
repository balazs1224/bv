import { Info, ShieldAlert } from "lucide-react";
import type { Scenario, Stage } from "@/lib/types";
import { COMPETENCIES } from "@/lib/data/meta";
import { ScenarioImageFrame } from "@/components/shared/scenario-image";
import { ProcessChain } from "@/components/system/process-chain";

export function SituationBrief({
  scenario,
  stage,
  onContinue,
}: {
  scenario: Scenario;
  stage: Stage;
  onContinue: () => void;
}) {
  const [primary, ...secondary] = scenario.competencies;

  return (
    <div className="border border-hairline bg-surface">
      <div className="grid lg:grid-cols-2">
        <ScenarioImageFrame
          image={scenario.visual?.hero}
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="order-2 min-h-[220px] lg:order-1"
          fallbackLabel="A helyszíni kép fejlesztés alatt – lásd IMAGE-INTEGRATION.md"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-surface/85 via-transparent to-transparent lg:bg-gradient-to-r" />
          <p className="absolute left-4 top-4 font-mono text-[11px] tabular-nums text-white/70">
            {(stage.time ?? scenario.time)}:00
          </p>
        </ScenarioImageFrame>

        <div className="order-1 flex flex-col justify-between gap-6 p-6 sm:p-8 lg:order-2">
          <div className="space-y-5">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-xs tabular-nums text-muted-foreground">
              <span className="text-foreground">{stage.time ?? scenario.time}</span>
              <span aria-hidden="true">/</span>
              <span>{scenario.code}</span>
              <span aria-hidden="true">/</span>
              <span className="uppercase tracking-wide">{scenario.location}</span>
            </div>

            <div className="space-y-2.5">
              <p className="type-eyebrow">Helyzet</p>
              <p className="text-[15px] leading-relaxed text-foreground/95">{stage.narrative}</p>
            </div>

            {scenario.processChain && (
              <div className="space-y-1.5">
                <p className="type-label">A feladat íve</p>
                <ProcessChain steps={scenario.processChain} />
              </div>
            )}

            <div className="grid gap-3 border-t border-hairline pt-4 sm:grid-cols-2">
              <div>
                <p className="type-label">Elsődleges kompetencia</p>
                <p className="text-[13.5px] text-foreground">{COMPETENCIES[primary].label}</p>
              </div>
              {secondary.length > 0 && (
                <div>
                  <p className="type-label">Fejleszti még</p>
                  <p className="text-[13.5px] text-muted-foreground">
                    {secondary.map((k) => COMPETENCIES[k].label).join(" · ")}
                  </p>
                </div>
              )}
            </div>

            {stage.helperText && (
              <div className="flex gap-2.5 border-l-2 border-primary/50 pl-4 text-[13px] leading-relaxed text-muted-foreground">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <p>{stage.helperText}</p>
              </div>
            )}

            {scenario.closingNote && (
              <div className="flex gap-2.5 border border-critical/30 bg-critical/[0.06] p-4">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-critical" aria-hidden="true" />
                <div className="space-y-1">
                  <p className="type-label text-critical">Záró komplex szituáció</p>
                  <p className="text-[13px] leading-relaxed text-foreground/85">{scenario.closingNote}</p>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onContinue}
            className="inline-flex w-fit items-center gap-2 bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Kezdés
          </button>
        </div>
      </div>
    </div>
  );
}

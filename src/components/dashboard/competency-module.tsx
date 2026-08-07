import { ArrowUp, ArrowDown } from "lucide-react";
import { COMPETENCIES, COMPETENCY_ORDER } from "@/lib/data/meta";
import type { CompetencyKey } from "@/lib/types";
import { CompetencyRadar } from "@/components/dashboard/competency-radar";
import { Divider } from "@/components/system/divider";

export function CompetencyModule({ values }: { values: Record<CompetencyKey, number> }) {
  const ranked = [...COMPETENCY_ORDER].sort((a, b) => values[b] - values[a]);
  const strongest = ranked[0];
  const weakest = ranked[ranked.length - 1];

  return (
    <div className="border border-hairline bg-surface p-6">
      <p className="type-eyebrow mb-1">Kompetenciaprofil</p>
      <h2 className="text-[15px] font-semibold text-foreground">Nyolc mért kompetencia</h2>

      <CompetencyRadar values={values} />

      <Divider className="mb-4" />

      <div className="space-y-3">
        <div className="flex items-start gap-2.5">
          <ArrowUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" />
          <p className="text-[13px] leading-relaxed text-foreground/85">
            <span className="font-medium text-foreground">{COMPETENCIES[strongest].label}</span> a legerősebb
            területed, {values[strongest]}%-on áll.
          </p>
        </div>
        <div className="flex items-start gap-2.5">
          <ArrowDown className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" aria-hidden="true" />
          <p className="text-[13px] leading-relaxed text-foreground/85">
            <span className="font-medium text-foreground">{COMPETENCIES[weakest].label}</span> igényli most a
            legtöbb gyakorlást, {values[weakest]}%-on áll.
          </p>
        </div>
      </div>
    </div>
  );
}

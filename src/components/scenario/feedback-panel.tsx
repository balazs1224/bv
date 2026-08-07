"use client";

import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, Zap, ShieldCheck, Lightbulb } from "lucide-react";
import type { CompetencyKey, DecisionQuality } from "@/lib/types";
import { COMPETENCIES } from "@/lib/data/meta";
import { QUALITY_META, formatSigned } from "@/lib/scenario-engine";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TONE_ICON: Record<string, typeof CheckCircle2> = {
  success: CheckCircle2,
  primary: CheckCircle2,
  warning: AlertTriangle,
  critical: XCircle,
};

const TONE_STYLES: Record<string, string> = {
  success: "border-success/35 bg-success/10 text-success",
  primary: "border-primary/35 bg-primary/10 text-primary",
  warning: "border-warning/35 bg-warning/10 text-warning",
  critical: "border-critical/35 bg-critical/10 text-critical",
};

export function FeedbackPanel({
  quality,
  xp,
  rationale,
  risksReduced,
  primaryCompetency,
  competencyDelta,
  takeaway,
  onContinue,
  continueLabel = "Tovább",
}: {
  quality: DecisionQuality;
  xp: number;
  rationale: string;
  risksReduced: string[];
  primaryCompetency: CompetencyKey;
  competencyDelta: number;
  takeaway: string;
  onContinue: () => void;
  continueLabel?: string;
}) {
  const meta = QUALITY_META[quality];
  const Icon = TONE_ICON[meta.tone];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-5 border-t border-border/70 pt-5"
      role="status"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className={cn("flex h-9 w-9 items-center justify-center rounded-full border", TONE_STYLES[meta.tone])}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Döntés értékelve</p>
            <p className="text-sm font-semibold text-foreground">{meta.label}</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
          <Zap className="h-3.5 w-3.5" aria-hidden="true" />
          {formatSigned(xp)} XP
        </span>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Miért?</p>
        <p className="text-sm leading-relaxed text-foreground/90">{rationale}</p>
      </div>

      {risksReduced.length > 0 && (
        <div className="space-y-1.5">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-success" aria-hidden="true" />
            Milyen kockázatot csökkentettél?
          </p>
          <ul className="space-y-1">
            {risksReduced.map((r, i) => (
              <li key={i} className="flex gap-2 text-sm leading-relaxed text-foreground/85">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-success" aria-hidden="true" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-1.5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Fejlesztett kompetencia</p>
        <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-3.5 py-2.5">
          <span className="text-sm font-medium text-foreground">{COMPETENCIES[primaryCompetency].label}</span>
          <span
            className={cn(
              "text-sm font-semibold tabular-nums",
              competencyDelta >= 0 ? "text-success" : "text-critical"
            )}
          >
            {formatSigned(competencyDelta)}%
          </span>
        </div>
      </div>

      <div className="flex gap-2.5 rounded-lg border border-primary/25 bg-accent/50 p-3.5">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <div className="space-y-0.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Mit jegyezz meg ebből?</p>
          <p className="text-sm leading-relaxed text-foreground/90">{takeaway}</p>
        </div>
      </div>

      <Button onClick={onContinue} size="lg">
        {continueLabel}
      </Button>
    </motion.div>
  );
}

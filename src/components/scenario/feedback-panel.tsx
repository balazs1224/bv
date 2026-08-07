"use client";

import { motion } from "framer-motion";
import type { CompetencyKey, DecisionQuality } from "@/lib/types";
import { COMPETENCIES } from "@/lib/data/meta";
import { QUALITY_META, formatSigned } from "@/lib/scenario-engine";
import { cn } from "@/lib/utils";

const TONE_TEXT: Record<string, string> = {
  success: "text-success",
  primary: "text-primary",
  warning: "text-warning",
  critical: "text-critical",
};

const TONE_DOT: Record<string, string> = {
  success: "bg-success",
  primary: "bg-primary",
  warning: "bg-warning",
  critical: "bg-critical",
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex h-full flex-col justify-between gap-6"
      role="status"
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-4">
          <div className="flex items-center gap-2.5">
            <span className={cn("h-1.5 w-1.5 rounded-full", TONE_DOT[meta.tone])} aria-hidden="true" />
            <div>
              <p className="type-eyebrow">Döntés értékelve</p>
              <p className={cn("text-[15px] font-semibold", TONE_TEXT[meta.tone])}>{meta.label}</p>
            </div>
          </div>
          <span className="font-mono text-sm tabular-nums text-primary">{formatSigned(xp)} XP</span>
        </div>

        <FieldBlock label="Miért?">
          <p className="text-[14px] leading-relaxed text-foreground/90">{rationale}</p>
        </FieldBlock>

        {risksReduced.length > 0 && (
          <FieldBlock label="Következmény — csökkentett kockázat">
            <ul className="space-y-1">
              {risksReduced.map((r, i) => (
                <li key={i} className="flex gap-2 text-[14px] leading-relaxed text-foreground/85">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-success" aria-hidden="true" />
                  {r}
                </li>
              ))}
            </ul>
          </FieldBlock>
        )}

        <FieldBlock label="Fejlesztett kompetencia">
          <div className="flex items-center gap-3">
            <span className="text-[14px] text-foreground/90">{COMPETENCIES[primaryCompetency].label}</span>
            <span
              className={cn(
                "font-mono text-[13px] tabular-nums",
                competencyDelta >= 0 ? "text-success" : "text-critical"
              )}
            >
              {formatSigned(competencyDelta)}%
            </span>
          </div>
        </FieldBlock>

        <FieldBlock label="Mit vigyél magaddal?">
          <p className="text-[14px] leading-relaxed text-foreground/90">{takeaway}</p>
        </FieldBlock>
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="inline-flex w-fit items-center gap-2 bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {continueLabel}
      </button>
    </motion.div>
  );
}

function FieldBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="type-label">{label}</p>
      {children}
    </div>
  );
}

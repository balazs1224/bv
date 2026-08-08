"use client";

import { motion } from "framer-motion";
import { RISK_DIMENSIONS, RISK_DIMENSION_ORDER } from "@/lib/data/meta";
import type { RiskDimensionKey, RiskLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

const LEVEL_INDEX: Record<RiskLevel, number> = { alacsony: 1, kozepes: 2, magas: 3 };
const LEVEL_LABEL: Record<RiskLevel, string> = { alacsony: "Alacsony", kozepes: "Közepes", magas: "Magas" };
const LEVEL_TONE: Record<RiskLevel, string> = {
  alacsony: "bg-success",
  kozepes: "bg-warning",
  magas: "bg-critical",
};
const LEVEL_TEXT_TONE: Record<RiskLevel, string> = {
  alacsony: "text-success",
  kozepes: "text-warning",
  magas: "text-critical",
};

export function RiskProfile({
  risk,
  changedFrom,
  className,
}: {
  risk: Record<RiskDimensionKey, RiskLevel>;
  changedFrom?: Partial<Record<RiskDimensionKey, RiskLevel>>;
  className?: string;
}) {
  const hasChange = RISK_DIMENSION_ORDER.some((key) => {
    const prev = changedFrom?.[key];
    return prev && prev !== risk[key];
  });

  return (
    <div className={cn("border border-hairline bg-surface p-5", className)}>
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <p className="type-eyebrow">Kockázati profil</p>
        {hasChange && (
          <p className="text-[11px] font-medium text-warning" role="status">
            A döntés hatására módosult
          </p>
        )}
      </div>
      <div className="space-y-3">
        {RISK_DIMENSION_ORDER.map((key) => {
          const meta = RISK_DIMENSIONS[key];
          const level = risk[key];
          const prev = changedFrom?.[key];
          const changed = prev && prev !== level;
          const filled = LEVEL_INDEX[level];

          return (
            <div key={key} className="flex items-center gap-3">
              <span className="w-[104px] shrink-0 text-[12.5px] leading-tight text-foreground/80 sm:w-[124px]">
                {meta.label}
              </span>
              <span className="flex shrink-0 gap-1" aria-hidden="true">
                {[1, 2, 3].map((seg) => (
                  <motion.span
                    key={seg}
                    className={cn("h-2.5 w-6 sm:w-8", seg <= filled ? LEVEL_TONE[level] : "bg-muted")}
                    initial={false}
                    animate={{ opacity: seg <= filled ? 1 : 0.5 }}
                    transition={{ duration: 0.4 }}
                  />
                ))}
              </span>
              <span className={cn("ml-auto shrink-0 font-mono text-[11px] uppercase tracking-wide", LEVEL_TEXT_TONE[level])}>
                {changed && (
                  <span className="mr-1.5 text-muted-foreground line-through decoration-1">
                    {LEVEL_LABEL[prev]}
                  </span>
                )}
                {LEVEL_LABEL[level]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

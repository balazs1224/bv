"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { RISK_DIMENSIONS, RISK_DIMENSION_ORDER } from "@/lib/data/meta";
import type { RiskDimensionKey, RiskLevel } from "@/lib/types";
import { RiskBadge, riskLevelToPercent } from "@/components/shared/risk-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const BAR_COLOR: Record<RiskLevel, string> = {
  alacsony: "bg-success",
  kozepes: "bg-warning",
  magas: "bg-critical",
};

export function RiskMatrix({
  risk,
  changedFrom,
  className,
}: {
  risk: Record<RiskDimensionKey, RiskLevel>;
  changedFrom?: Partial<Record<RiskDimensionKey, RiskLevel>>;
  className?: string;
}) {
  return (
    <Card className={cn("border-border/80 bg-card", className)}>
      <CardHeader>
        <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Dinamikus kockázati térkép
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {RISK_DIMENSION_ORDER.map((key) => {
          const meta = RISK_DIMENSIONS[key];
          const level = risk[key];
          const prev = changedFrom?.[key];
          const changed = prev && prev !== level;
          return (
            <div key={key} className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-foreground/85">{meta.label}</span>
                <AnimatePresence mode="wait">
                  {changed ? (
                    <motion.div
                      key="changed"
                      initial={{ opacity: 0, y: -2 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-1"
                    >
                      <RiskBadge level={prev} className="opacity-60" />
                      <ArrowRight className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                      <RiskBadge level={level} />
                    </motion.div>
                  ) : (
                    <motion.div key="static" initial={false} animate={{ opacity: 1 }}>
                      <RiskBadge level={level} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted" aria-hidden="true">
                <motion.div
                  className={cn("h-full rounded-full", BAR_COLOR[level])}
                  animate={{ width: `${riskLevelToPercent(level)}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

import { ShieldCheck, TriangleAlert, OctagonAlert } from "lucide-react";
import type { RiskLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

const RISK_META: Record<RiskLevel, { label: string; icon: typeof ShieldCheck; className: string }> = {
  alacsony: { label: "Alacsony", icon: ShieldCheck, className: "text-success border-success/30 bg-success/10" },
  kozepes: { label: "Közepes", icon: TriangleAlert, className: "text-warning border-warning/30 bg-warning/10" },
  magas: { label: "Magas", icon: OctagonAlert, className: "text-critical border-critical/30 bg-critical/10" },
};

export function RiskBadge({ level, className }: { level: RiskLevel; className?: string }) {
  const meta = RISK_META[level];
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium",
        meta.className,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {meta.label}
    </span>
  );
}

export function riskLevelToPercent(level: RiskLevel) {
  return level === "alacsony" ? 33 : level === "kozepes" ? 66 : 100;
}

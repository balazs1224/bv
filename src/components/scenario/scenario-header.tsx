import Link from "next/link";
import { X } from "lucide-react";
import type { Scenario } from "@/lib/types";
import { StatusDot } from "@/components/system/panel";
import { cn } from "@/lib/utils";

export function ScenarioHeader({
  scenario,
  currentTime,
  isComplete,
  xp,
  stageIndex,
  stageCount,
}: {
  scenario: Scenario;
  currentTime: string;
  isComplete: boolean;
  xp: number;
  stageIndex: number;
  stageCount: number;
}) {
  const progressPct = Math.round(((stageIndex + 1) / stageCount) * 100);

  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-background">
      <div className="h-[2px] w-full bg-hairline">
        <div
          className="h-full bg-primary transition-[width] duration-500 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <div className="mx-auto flex h-12 max-w-[1440px] items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Kilépés a szituációból, vissza a vezérlőpultra"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </Link>

        <div className="hidden h-4 w-px bg-hairline sm:block" aria-hidden="true" />

        <div className="flex min-w-0 flex-1 items-center gap-x-3 overflow-hidden font-mono text-[12px] tabular-nums text-muted-foreground">
          <span className="text-foreground">{currentTime}</span>
          <span aria-hidden="true" className="text-hairline">/</span>
          <span className="hidden sm:inline">{scenario.code}</span>
          <span aria-hidden="true" className="hidden text-hairline sm:inline">/</span>
          <span className="truncate uppercase tracking-wide">{scenario.location}</span>
        </div>

        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide",
            isComplete ? "text-success" : "text-warning"
          )}
        >
          <StatusDot tone={isComplete ? "success" : "warning"} className={!isComplete ? "animate-pulse" : undefined} />
          <span className="hidden sm:inline">{isComplete ? "Lezárva" : "Folyamatban"}</span>
        </span>

        <span className="hidden shrink-0 items-center gap-1 font-mono text-[12px] tabular-nums text-primary sm:inline-flex">
          {xp} XP
        </span>

        <span className="hidden shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground md:inline">
          {stageIndex + 1}/{stageCount}
        </span>
      </div>
    </header>
  );
}

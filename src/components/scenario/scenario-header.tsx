import Link from "next/link";
import { X, Zap } from "lucide-react";
import type { Scenario } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ScenarioHeader({
  scenario,
  currentTime,
  isComplete,
  xp,
}: {
  scenario: Scenario;
  currentTime: string;
  isComplete: boolean;
  xp: number;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Kilépés a szituációból, vissza a vezérlőpultra"
        >
          <X className="h-4.5 w-4.5" aria-hidden="true" />
        </Link>

        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
          <span className="rounded border border-border px-1.5 py-0.5 font-mono text-xs tracking-wide text-foreground/80">
            {scenario.code}
          </span>
          <span className="font-mono text-sm tabular-nums text-foreground/90">{currentTime}</span>
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {scenario.location.toUpperCase()}
          </span>
          <h1 className="w-full truncate text-sm font-semibold text-foreground sm:hidden">{scenario.title}</h1>
        </div>

        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
            isComplete
              ? "border-success/30 bg-success/10 text-success"
              : "border-warning/30 bg-warning/10 text-warning"
          )}
        >
          <span
            className={cn("h-1.5 w-1.5 rounded-full", isComplete ? "bg-success" : "animate-pulse bg-warning")}
            aria-hidden="true"
          />
          {isComplete ? "LEZÁRVA" : "FOLYAMATBAN"}
        </span>

        <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-xs font-semibold text-secondary-foreground sm:inline-flex">
          <Zap className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          {xp} XP
        </span>
      </div>
    </header>
  );
}

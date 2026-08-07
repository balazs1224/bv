import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Scenario } from "@/lib/types";
import { StatusDot } from "@/components/system/panel";

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

export function SituationRow({ scenario }: { scenario: Scenario }) {
  return (
    <li>
      <Link
        href={`/szituacio/${scenario.id}`}
        className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 py-4 transition-colors hover:bg-surface-raised/60 sm:grid-cols-[64px_1fr_auto_20px] sm:gap-5 sm:px-2"
      >
        <span className="hidden font-mono text-[11px] tabular-nums text-muted-foreground sm:block">
          {scenario.code.replace("ESET ", "E")}
        </span>

        <span className="min-w-0">
          <span className="block truncate text-[14px] font-medium text-foreground">{scenario.title}</span>
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">{scenario.description}</span>
        </span>

        <span className="hidden items-center gap-4 whitespace-nowrap text-xs text-muted-foreground sm:flex">
          <span className="inline-flex items-center gap-1.5">
            <StatusDot tone={DIFFICULTY_TONE[scenario.difficulty]} />
            {DIFFICULTY_LABEL[scenario.difficulty]}
          </span>
          <span>{scenario.estimatedTime}</span>
        </span>

        <ArrowRight
          className="hidden h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground sm:block"
          aria-hidden="true"
        />
      </Link>
    </li>
  );
}

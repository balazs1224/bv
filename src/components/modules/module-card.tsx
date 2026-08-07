import Link from "next/link";
import { Clock, Lock, CheckCircle2, ArrowRight, PlayCircle } from "lucide-react";
import type { TrainingModule } from "@/lib/types";
import { COMPETENCIES } from "@/lib/data/meta";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DifficultyBadge } from "@/components/shared/difficulty-badge";
import { cn } from "@/lib/utils";

const STATUS_META: Record<TrainingModule["status"], { label: string; className: string }> = {
  nincs_elkezdve: { label: "Nincs elkezdve", className: "text-muted-foreground border-border" },
  folyamatban: { label: "Folyamatban", className: "text-warning border-warning/30 bg-warning/10" },
  teljesitve: { label: "Teljesítve", className: "text-success border-success/30 bg-success/10" },
  zarolt: { label: "Zárolva", className: "text-muted-foreground border-border" },
};

export function ModuleCard({ module: m }: { module: TrainingModule }) {
  const status = STATUS_META[m.status];
  const locked = m.status === "zarolt";

  return (
    <Card className={cn("flex h-full flex-col border-border/80 bg-card", locked && "opacity-70")}>
      <CardContent className="flex h-full flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="font-mono text-xs text-muted-foreground">{m.index}</span>
          <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium", status.className)}>
            {m.status === "teljesitve" && <CheckCircle2 className="h-3 w-3" aria-hidden="true" />}
            {locked && <Lock className="h-3 w-3" aria-hidden="true" />}
            {status.label}
          </span>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-sm font-semibold leading-snug text-foreground">{m.title}</h3>
          <p className="text-xs leading-relaxed text-muted-foreground">{m.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <DifficultyBadge difficulty={m.difficulty} className="text-[11px]" />
          <span className="inline-flex items-center gap-1 rounded-md border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" aria-hidden="true" />
            {m.estimatedTime}
          </span>
          <span className="inline-flex items-center rounded-md border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground">
            {COMPETENCIES[m.competency].shortLabel}
          </span>
        </div>

        <div className="mt-auto space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Haladás</span>
              <span className="tabular-nums">{m.progress}%</span>
            </div>
            <Progress value={m.progress} className="h-1.5" />
          </div>

          {locked ? (
            <Button size="sm" variant="outline" disabled className="w-full justify-center gap-1.5">
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              Zárolva
            </Button>
          ) : (
            <Button
              render={<Link href="/szituacio/eset-07" />}
              nativeButton={false}
              size="sm"
              variant={m.status === "teljesitve" ? "secondary" : "default"}
              className="w-full justify-between"
            >
              {m.status === "nincs_elkezdve" && (
                <>
                  Indítás <PlayCircle className="h-3.5 w-3.5" aria-hidden="true" />
                </>
              )}
              {m.status === "folyamatban" && (
                <>
                  Folytatás <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </>
              )}
              {m.status === "teljesitve" && (
                <>
                  Áttekintés <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

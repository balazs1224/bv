import { Info } from "lucide-react";
import type { Stage } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function SituationBrief({ stage, onContinue }: { stage: Stage; onContinue: () => void }) {
  return (
    <Card className="border-border/80 bg-card">
      <CardContent className="space-y-5 p-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Helyzet</p>
          <p className="text-base leading-relaxed text-foreground/95">{stage.narrative}</p>
        </div>
        {stage.helperText && (
          <div className="flex gap-2.5 rounded-lg border border-border bg-secondary/40 p-3.5 text-sm text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <p>{stage.helperText}</p>
          </div>
        )}
        <Button onClick={onContinue} size="lg">
          Kezdés
        </Button>
      </CardContent>
    </Card>
  );
}

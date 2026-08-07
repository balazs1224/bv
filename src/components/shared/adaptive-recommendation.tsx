import Link from "next/link";
import { Sparkles, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AdaptiveRecommendation({ className }: { className?: string }) {
  return (
    <Card className={cn("border-primary/25 bg-gradient-to-br from-accent/60 to-card", className)}>
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Sparkles className="h-4.5 w-4.5" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Személyre szabott gyakorlás</p>
            <p className="text-sm leading-relaxed text-foreground/90">
              Az előző három szituáció alapján a kommunikációs döntéseid erősek, azonban az
              információgyűjtésben további gyakorlást javaslunk.
            </p>
          </div>
        </div>
        <Button render={<Link href="/mikrotanulas" />} nativeButton={false} size="sm" className="self-start">
          5 perces gyakorlás
        </Button>

        <div className="flex items-start gap-3 border-t border-border/70 pt-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-success/15 text-success">
            <TrendingUp className="h-4.5 w-4.5" aria-hidden="true" />
          </div>
          <p className="text-sm leading-relaxed text-foreground/90">
            A helyzetfelismerési feladatokat stabilan teljesíted. A következő szituáció
            komplexitása emelkedik.
          </p>
        </div>

        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Szabályalapú, szimulált ajánlás demonstrációs célra – az éles rendszerben ez a
          tanulási előzmények alapján, adaptív motorral működne.
        </p>
      </CardContent>
    </Card>
  );
}

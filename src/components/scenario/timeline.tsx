import { Check } from "lucide-react";
import type { TimelineEvent } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Timeline({
  events,
  revealedCount,
  className,
}: {
  events: TimelineEvent[];
  revealedCount: number;
  className?: string;
}) {
  return (
    <Card className={cn("border-border/80 bg-card", className)}>
      <CardHeader>
        <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Incidens időrend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="space-y-0">
          {events.map((event, i) => {
            const done = i < revealedCount;
            const active = i === revealedCount - 1;
            const isLast = i === events.length - 1;
            return (
              <li key={event.id} className="relative flex gap-3 pb-5 last:pb-0">
                {!isLast && (
                  <span
                    className={cn(
                      "absolute left-[9px] top-5 h-full w-px",
                      done ? "bg-primary/40" : "bg-border"
                    )}
                    aria-hidden="true"
                  />
                )}
                <span
                  className={cn(
                    "z-10 mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    done
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-transparent"
                  )}
                  aria-hidden="true"
                >
                  {done && <Check className="h-3 w-3" strokeWidth={3} />}
                </span>
                <div className={cn("min-w-0 pt-px", !done && "opacity-45")}>
                  <p
                    className={cn(
                      "font-mono text-xs tabular-nums",
                      active ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {event.time}
                  </p>
                  <p className={cn("text-sm leading-snug", active ? "font-medium text-foreground" : "text-foreground/80")}>
                    {event.label}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}

import type { TimelineEvent } from "@/lib/types";
import { cn } from "@/lib/utils";

export function IncidentTimeline({
  events,
  revealedCount,
  className,
}: {
  events: TimelineEvent[];
  revealedCount: number;
  className?: string;
}) {
  return (
    <div className={cn("border border-hairline bg-surface p-5", className)}>
      <p className="type-eyebrow mb-4">Incidens idővonal</p>
      <ol className="space-y-0">
        {events.map((event, i) => {
          const done = i < revealedCount;
          const active = i === revealedCount - 1;
          const isLast = i === events.length - 1;
          return (
            <li key={event.id} className="relative flex gap-3.5 pb-4 last:pb-0">
              {!isLast && (
                <span
                  className={cn("absolute left-[3px] top-3 h-full w-px", done ? "bg-primary/35" : "bg-hairline")}
                  aria-hidden="true"
                />
              )}
              <span
                className={cn(
                  "z-10 mt-[5px] h-[7px] w-[7px] shrink-0 rounded-full transition-colors",
                  active ? "bg-primary" : done ? "bg-primary/50" : "bg-muted"
                )}
                aria-hidden="true"
              />
              <div className={cn("min-w-0 pb-0.5", !done && "opacity-40")}>
                <p className={cn("font-mono text-[11px] tabular-nums", active ? "text-primary" : "text-muted-foreground")}>
                  {event.time}:00
                </p>
                <p className={cn("text-[13px] leading-snug", active ? "font-medium text-foreground" : "text-foreground/80")}>
                  {event.label}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

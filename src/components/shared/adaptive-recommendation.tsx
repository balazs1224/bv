import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdaptiveRecommendation({ className }: { className?: string }) {
  return (
    <div className={cn("border border-hairline bg-surface p-6", className)}>
      <p className="type-eyebrow mb-3">Személyre szabott gyakorlás</p>

      <div className="space-y-4 border-l-2 border-primary/60 pl-4">
        <p className="text-[13px] leading-relaxed text-foreground/85">
          Az előző három szituáció alapján a kommunikációs döntéseid erősek, azonban az
          információgyűjtésben további gyakorlást javaslunk.
        </p>
        <Link
          href="/mikrotanulas"
          className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary"
        >
          5 perces gyakorlás
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-5 space-y-4 border-l-2 border-success/50 pl-4">
        <p className="text-[13px] leading-relaxed text-foreground/85">
          A helyzetfelismerési feladatokat stabilan teljesíted. A következő szituáció
          komplexitása emelkedik.
        </p>
      </div>

      <p className="mt-5 text-[11px] leading-relaxed text-muted-foreground">
        Szabályalapú, szimulált ajánlás demonstrációs célra – az éles rendszerben ez a tanulási
        előzmények alapján, adaptív motorral működne.
      </p>
    </div>
  );
}

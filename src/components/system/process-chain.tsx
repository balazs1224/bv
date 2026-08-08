import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProcessChain({ steps, className }: { steps: string[]; className?: string }) {
  return (
    <ol className={cn("flex flex-wrap items-center gap-x-2 gap-y-1.5", className)}>
      {steps.map((step, i) => (
        <li key={step} className="flex items-center gap-2">
          <span className="border border-hairline px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-foreground/80">
            {step}
          </span>
          {i < steps.length - 1 && <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" aria-hidden="true" />}
        </li>
      ))}
    </ol>
  );
}

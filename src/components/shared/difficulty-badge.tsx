import type { Difficulty } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const LABELS: Record<Difficulty, string> = {
  kezdo: "Kezdő",
  kozepes: "Közepes",
  halado: "Haladó",
};

const STYLES: Record<Difficulty, string> = {
  kezdo: "border-success/30 bg-success/10 text-success",
  kozepes: "border-warning/30 bg-warning/10 text-warning",
  halado: "border-critical/30 bg-critical/10 text-critical",
};

export function DifficultyBadge({ difficulty, className }: { difficulty: Difficulty; className?: string }) {
  return (
    <Badge variant="outline" className={cn(STYLES[difficulty], className)}>
      {LABELS[difficulty]}
    </Badge>
  );
}

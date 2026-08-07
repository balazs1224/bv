import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Minimal structural container — hairline border, no shadow/ring/heavy radius.
 * Used instead of the shadcn Card everywhere a boxed grouping is genuinely needed.
 */
export function Panel({
  children,
  className,
  as: As = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
}) {
  return <As className={cn("border border-hairline bg-surface", className)}>{children}</As>;
}

export function StatusDot({
  tone,
  className,
}: {
  tone: "success" | "warning" | "critical" | "neutral" | "primary";
  className?: string;
}) {
  const map: Record<string, string> = {
    success: "bg-success",
    warning: "bg-warning",
    critical: "bg-critical",
    neutral: "bg-muted-foreground",
    primary: "bg-primary",
  };
  return <span className={cn("inline-block h-1.5 w-1.5 shrink-0 rounded-full", map[tone], className)} aria-hidden="true" />;
}

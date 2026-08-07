import { cn } from "@/lib/utils";

export function Divider({ className, vertical = false }: { className?: string; vertical?: boolean }) {
  return (
    <div
      role="separator"
      aria-orientation={vertical ? "vertical" : "horizontal"}
      className={cn(vertical ? "w-px self-stretch bg-hairline" : "h-px w-full bg-hairline", className)}
    />
  );
}

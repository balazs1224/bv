import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex items-end justify-between gap-4", className)}>
      <div className="space-y-0.5">
        {eyebrow && <p className="type-eyebrow">{eyebrow}</p>}
        <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function Section({
  eyebrow,
  title,
  action,
  children,
  className,
}: {
  eyebrow?: string;
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      {title && <SectionHeading eyebrow={eyebrow} title={title} action={action} />}
      {children}
    </section>
  );
}

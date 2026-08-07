export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 2.5 35 8.5V19c0 9.4-6.1 16.9-15 18.5C11.1 35.9 5 28.4 5 19V8.5L20 2.5Z"
        className="fill-primary/15 stroke-primary"
        strokeWidth="1.6"
      />
      <path d="M20 9.5 29 13v6.3c0 6.1-3.7 10.6-9 12-5.3-1.4-9-5.9-9-12V13l9-3.5Z" className="fill-primary/25" />
      <path d="M14.5 20.2 18.3 24l7.2-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground" />
    </svg>
  );
}

export function BrandLockup({ className }: { className?: string }) {
  return (
    <div className={"flex items-center gap-2.5 " + (className ?? "")}>
      <LogoMark className="h-8 w-8 shrink-0" />
      <div className="leading-tight">
        <p className="text-sm font-semibold tracking-wide text-foreground">BIZTONSÁGI DÖNTÉSTÁR</p>
        <p className="text-[11px] text-muted-foreground">Szituációs képzési platform</p>
      </div>
    </div>
  );
}

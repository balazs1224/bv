"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { LogoMark } from "./logo";
import { NAV_ITEMS } from "./nav-config";
import { useRole, type Role } from "./role-context";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { LEARNER } from "@/lib/data/learner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function RoleToggle({ orientation = "vertical" }: { orientation?: "vertical" | "horizontal" }) {
  const { role, setRole } = useRole();
  const router = useRouter();
  const options: { key: Role; label: string }[] = [
    { key: "tanulo", label: "Tanuló" },
    { key: "oktato", label: "Oktató" },
  ];
  const handleSelect = (next: Role) => {
    setRole(next);
    router.push(next === "oktato" ? "/oktato" : "/");
  };
  return (
    <div
      role="group"
      aria-label="Szerepkör választása"
      className={cn(
        "inline-flex overflow-hidden border border-hairline",
        orientation === "vertical" ? "flex-col" : "flex-row"
      )}
    >
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          aria-pressed={role === opt.key}
          onClick={() => handleSelect(opt.key)}
          className={cn(
            "px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            role === opt.key
              ? "bg-primary text-primary-foreground"
              : "bg-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function RailNavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { role } = useRole();
  const items = NAV_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <nav aria-label="Fő navigáció" className="flex w-full flex-col items-center gap-0.5 px-2">
      {items.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Tooltip key={item.href}>
            <TooltipTrigger
              render={
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative flex w-full flex-col items-center gap-1 py-2.5 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground/85"
                  )}
                />
              }
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 bg-primary transition-opacity",
                  active ? "opacity-100" : "opacity-0"
                )}
              />
              <Icon className="h-[18px] w-[18px]" aria-hidden="true" strokeWidth={1.75} />
              <span className="text-[9.5px] font-medium uppercase tracking-wide leading-none">
                {item.shortLabel}
              </span>
            </TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        );
      })}
    </nav>
  );
}

function RailContent() {
  return (
    <div className="flex h-full w-full flex-col items-center gap-6 py-5">
      <Tooltip>
        <TooltipTrigger render={<Link href="/" aria-label="Biztonsági Döntéstár – Vezérlőpult" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />}>
          <LogoMark className="h-8 w-8" />
        </TooltipTrigger>
        <TooltipContent side="right">Biztonsági Döntéstár</TooltipContent>
      </Tooltip>

      <RailNavList />

      <div className="mt-auto flex flex-col items-center gap-4">
        <RoleToggle />
        <Avatar className="h-8 w-8 border border-hairline">
          <AvatarFallback className="bg-accent text-[11px] font-semibold text-accent-foreground">
            {initials(LEARNER.name)}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}

function MobileHeader() {
  const [open, setOpen] = useState(false);
  const { role } = useRole();
  const items = NAV_ITEMS.filter((item) => item.roles.includes(role));
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b border-hairline bg-background px-4 lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={<button type="button" aria-label="Menü megnyitása" className="-ml-1.5 p-1.5 text-foreground" />}>
          <Menu className="h-5 w-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-72 border-r border-hairline bg-sidebar p-0 text-sidebar-foreground">
          <SheetTitle className="sr-only">Navigáció</SheetTitle>
          <div className="flex items-center gap-2.5 border-b border-hairline px-5 py-4">
            <LogoMark className="h-7 w-7 shrink-0" />
            <div className="leading-tight">
              <p className="text-[13px] font-semibold tracking-wide text-foreground">BIZTONSÁGI DÖNTÉSTÁR</p>
              <p className="text-[10px] text-muted-foreground">Szituációs képzési platform</p>
            </div>
          </div>
          <nav aria-label="Fő navigáció" className="flex flex-col p-2">
            {items.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-sm transition-colors",
                    active ? "bg-sidebar-accent text-foreground" : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" strokeWidth={1.75} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto px-5 py-4">
            <p className="type-label mb-2">Szerepkör</p>
            <RoleToggle orientation="horizontal" />
          </div>
        </SheetContent>
      </Sheet>

      <Link href="/" className="flex items-center gap-2">
        <LogoMark className="h-6 w-6" />
        <span className="text-[13px] font-semibold tracking-wide">Döntéstár</span>
      </Link>

      <span className="ml-auto type-label">{role === "oktato" ? "Oktató" : "Tanuló"}</span>
    </header>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      <a
        href="#fo-tartalom"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Ugrás a tartalomhoz
      </a>

      <aside className="hidden w-[80px] shrink-0 border-r border-hairline bg-sidebar lg:block">
        <div className="sticky top-0 h-screen">
          <RailContent />
        </div>
      </aside>

      <MobileHeader />

      <main id="fo-tartalom" className="min-w-0 flex-1">
        {children}
      </main>
    </div>
  );
}

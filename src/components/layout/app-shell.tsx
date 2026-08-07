"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, ChevronRight } from "lucide-react";
import { BrandLockup, LogoMark } from "./logo";
import { NAV_ITEMS } from "./nav-config";
import { useRole, type Role } from "./role-context";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
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

function RoleSwitch() {
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
      role="radiogroup"
      aria-label="Szerepkör választása"
      className="inline-flex items-center rounded-full border border-border bg-surface p-0.5 text-xs"
    >
      {options.map((opt) => (
        <button
          key={opt.key}
          role="radio"
          aria-checked={role === opt.key}
          onClick={() => handleSelect(opt.key)}
          className={cn(
            "rounded-full px-3 py-1.5 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            role === opt.key
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { role } = useRole();
  const items = NAV_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <nav aria-label="Fő navigáció" className="flex flex-col gap-1">
      {items.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "bg-sidebar-accent text-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
            )}
          >
            <Icon className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} aria-hidden="true" />
            <span className="truncate">{item.label}</span>
            {active && <ChevronRight className="ml-auto h-3.5 w-3.5 text-primary" aria-hidden="true" />}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarInner() {
  return (
    <div className="flex h-full flex-col gap-6 px-4 py-5">
      <BrandLockup />
      <NavList />
      <div className="mt-auto flex items-center gap-3 rounded-xl border border-sidebar-border bg-sidebar-accent/40 px-3 py-3">
        <Avatar className="h-9 w-9 border border-border">
          <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
            {initials(LEARNER.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-medium text-foreground">{LEARNER.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {LEARNER.level} · {LEARNER.levelNumber}. szint
          </p>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      <a
        href="#fo-tartalom"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Ugrás a tartalomhoz
      </a>
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarInner />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/70 sm:px-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menü megnyitása" />}
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-sidebar p-0 text-sidebar-foreground">
              <SheetTitle className="sr-only">Navigáció</SheetTitle>
              <SidebarInner />
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2 lg:hidden">
            <LogoMark className="h-6 w-6" />
            <span className="text-sm font-semibold">Döntéstár</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <RoleSwitch />
          </div>
        </header>

        <main id="fo-tartalom" className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

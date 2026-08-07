import type { LucideIcon } from "lucide-react";
import { Compass, GraduationCap, Zap, Users2, FileEdit, Presentation } from "lucide-react";
import type { Role } from "./role-context";

export interface NavItem {
  href: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  roles: Role[];
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Vezérlőpult", shortLabel: "Kezdőlap", icon: Compass, roles: ["tanulo"] },
  { href: "/kepzesek", label: "Képzések", shortLabel: "Képzések", icon: GraduationCap, roles: ["tanulo"] },
  { href: "/mikrotanulas", label: "5 perces gyakorlás", shortLabel: "Gyakorlás", icon: Zap, roles: ["tanulo"] },
  { href: "/oktato", label: "Oktatói áttekintés", shortLabel: "Áttekintés", icon: Users2, roles: ["oktato"] },
  { href: "/oktato/szerkeszto", label: "Szituációszerkesztő", shortLabel: "Szerkesztő", icon: FileEdit, roles: ["oktato"] },
  { href: "/demo", label: "Pályázati demo", shortLabel: "Demo", icon: Presentation, roles: ["tanulo", "oktato"] },
];

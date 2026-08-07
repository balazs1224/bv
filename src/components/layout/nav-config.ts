import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, GraduationCap, Zap, Users2, FileEdit, PlayCircle } from "lucide-react";
import type { Role } from "./role-context";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: Role[];
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Vezérlőpult", icon: LayoutDashboard, roles: ["tanulo"] },
  { href: "/kepzesek", label: "Képzések", icon: GraduationCap, roles: ["tanulo"] },
  { href: "/mikrotanulas", label: "5 perces gyakorlás", icon: Zap, roles: ["tanulo"] },
  { href: "/oktato", label: "Oktatói áttekintés", icon: Users2, roles: ["oktato"] },
  { href: "/oktato/szerkeszto", label: "Szituációszerkesztő", icon: FileEdit, roles: ["oktato"] },
  { href: "/demo", label: "Pályázati demo", icon: PlayCircle, roles: ["tanulo", "oktato"] },
];

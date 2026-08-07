import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RoleProvider } from "@/components/layout/role-context";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Biztonsági Döntéstár – Interaktív szituációs képzési platform",
  description:
    "Interaktív szituációs képzési platform a büntetés-végrehajtási állomány számára. Demo pályázati bemutató.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="hu"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <RoleProvider>
          <TooltipProvider delay={200}>{children}</TooltipProvider>
        </RoleProvider>
      </body>
    </html>
  );
}

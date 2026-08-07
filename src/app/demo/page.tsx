import Link from "next/link";
import {
  X,
  LayoutDashboard,
  ShieldAlert,
  ScanEye,
  Gauge,
  MessageCircle,
  ClipboardCheck,
  Radar,
  Users2,
  ArrowRight,
  Clock,
} from "lucide-react";
import { BrandLockup } from "@/components/layout/logo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const STEPS: {
  icon: typeof LayoutDashboard;
  title: string;
  description: string;
  href: string;
  cta: string;
}[] = [
  {
    icon: LayoutDashboard,
    title: "Tanulói dashboard",
    description:
      "Személyre szabott üdvözlés, szint, teljesítési mutatók és kompetenciaprofil – az első benyomás a platform komolyságáról.",
    href: "/",
    cta: "Dashboard megnyitása",
  },
  {
    icon: ShieldAlert,
    title: "Mai szituáció",
    description: "„19:36 – Feszültség egy zárkakörleten” – a napi ajánlott, valósághű szolgálati helyzet.",
    href: "/szituacio/eset-07",
    cta: "Szituáció megnyitása",
  },
  {
    icon: ScanEye,
    title: "Helyzetfelismerés",
    description:
      "A megfigyelési feladat és a helyszíni tudatosság gyakorlat – mutasd be, hogyan válogatja ki a tanuló a kritikus információkat.",
    href: "/szituacio/eset-07",
    cta: "Folytatás a szituációban",
  },
  {
    icon: Gauge,
    title: "Kockázatértékelés",
    description: "A dinamikus kockázati térkép élőben változik a meghozott döntés hatására – MAGAS → KÖZEPES.",
    href: "/szituacio/eset-07",
    cta: "Folytatás a szituációban",
  },
  {
    icon: MessageCircle,
    title: "Kommunikációs döntés",
    description: "A deeszkalációs kommunikációs feladat – hangnem, világosság, kontroll és eszkalációs kockázat értékelése.",
    href: "/szituacio/eset-07",
    cta: "Folytatás a szituációban",
  },
  {
    icon: ClipboardCheck,
    title: "Következmény és szakmai feedback",
    description: "„Döntés értékelve” – miért, milyen kockázatot csökkentett, mit érdemes megjegyezni.",
    href: "/szituacio/eset-07",
    cta: "Folytatás a szituációban",
  },
  {
    icon: Radar,
    title: "Kompetenciafejlődés",
    description: "A radar diagram és a kompetenciasávok a döntések alapján frissülnek – vissza a dashboardra.",
    href: "/",
    cta: "Kompetenciaprofil megtekintése",
  },
  {
    icon: Users2,
    title: "Oktatói analitika",
    description: "Csoportos teljesítmény, kompetencia heatmap és automatikus insightok az oktatói nézetben.",
    href: "/oktato",
    cta: "Oktatói nézet megnyitása",
  },
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
          <BrandLockup />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Kilépés a demóból
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6">
        <div className="space-y-3 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            Kb. 5 perces vezetett bemutató
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Pályázati demo</h1>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground">
            Az alábbi nyolc lépés végigvezeti a bíráló bizottságot a Biztonsági Döntéstár teljes tanulási ívén –
            a dashboardtól a szituációs döntéshozatalon át az oktatói analitikáig. Minden lépés a valódi
            felületet nyitja meg, projektoros bemutatásra optimalizálva.
          </p>
        </div>

        <ol className="space-y-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <li key={step.title}>
                <Card className="border-border/80 bg-card">
                  <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3 sm:w-64 sm:shrink-0">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-sm font-semibold text-primary">
                        {i + 1}
                      </span>
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/60 text-foreground/80">
                        <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                      </span>
                      <h2 className="text-sm font-semibold text-foreground">{step.title}</h2>
                    </div>
                    <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                    <Button render={<Link href={step.href} />} nativeButton={false} variant="secondary" size="sm" className="shrink-0 gap-1.5 self-start sm:self-auto">
                      {step.cta}
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Button>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ol>

        <Card className="border-dashed border-border/80 bg-transparent">
          <CardContent className="p-5 text-center text-xs leading-relaxed text-muted-foreground">
            Demonstrációs frontend – strukturált mock adatokkal működik, valós backenddel és LMS-sel később
            integrálható architektúrára építve.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

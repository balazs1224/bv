import Link from "next/link";
import { X, ArrowRight, Clock } from "lucide-react";
import { BrandLockup } from "@/components/layout/logo";

const STEPS: { title: string; description: string; href: string; cta: string }[] = [
  {
    title: "Tanulói dashboard",
    description:
      "Személyre szabott üdvözlés, szint, teljesítési mutatók és kompetenciaprofil – az első benyomás a platform komolyságáról.",
    href: "/",
    cta: "Dashboard megnyitása",
  },
  {
    title: "Mai szituáció",
    description: "„19:36 – Feszültség egy zárkakörleten” – a napi ajánlott, valósághű szolgálati helyzet.",
    href: "/szituacio/eset-07",
    cta: "Szituáció megnyitása",
  },
  {
    title: "Helyzetfelismerés",
    description:
      "A megfigyelési feladat és a helyszíni tudatosság gyakorlat – mutasd be, hogyan válogatja ki a tanuló a kritikus információkat.",
    href: "/szituacio/eset-07",
    cta: "Folytatás a szituációban",
  },
  {
    title: "Kockázatértékelés",
    description: "A kockázati profil élőben változik a meghozott döntés hatására – magas kockázat közepesre csökken.",
    href: "/szituacio/eset-07",
    cta: "Folytatás a szituációban",
  },
  {
    title: "Kommunikációs döntés",
    description: "A deeszkalációs kommunikációs feladat – hangnem, világosság, kontroll és eszkalációs kockázat értékelése.",
    href: "/szituacio/eset-07",
    cta: "Folytatás a szituációban",
  },
  {
    title: "Következmény és szakmai feedback",
    description: "„Döntés értékelve” – miért, milyen kockázatot csökkentett, mit érdemes megjegyezni.",
    href: "/szituacio/eset-07",
    cta: "Folytatás a szituációban",
  },
  {
    title: "Kompetenciafejlődés",
    description: "A radar diagram és a kompetenciasávok a döntések alapján frissülnek – vissza a dashboardra.",
    href: "/",
    cta: "Kompetenciaprofil megtekintése",
  },
  {
    title: "Oktatói analitika",
    description: "Csoportos teljesítmény, kompetencia heatmap és automatikus insightok az oktatói nézetben.",
    href: "/oktato",
    cta: "Oktatói nézet megnyitása",
  },
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-hairline bg-background">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4 sm:px-8">
          <BrandLockup />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Kilépés
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-10 px-5 py-12 sm:px-8">
        <div className="space-y-3">
          <p className="type-eyebrow inline-flex items-center gap-1.5 text-primary">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            Kb. 5 perces vezetett bemutató
          </p>
          <h1 className="font-display text-3xl text-foreground sm:text-4xl">Pályázati demo</h1>
          <p className="max-w-xl text-[14px] leading-relaxed text-muted-foreground">
            Az alábbi nyolc lépés végigvezeti a bíráló bizottságot a Biztonsági Döntéstár teljes tanulási ívén –
            a dashboardtól a szituációs döntéshozatalon át az oktatói analitikáig. Minden lépés a valódi
            felületet nyitja meg, projektoros bemutatásra optimalizálva.
          </p>
        </div>

        <ol className="divide-y divide-hairline border-y border-hairline">
          {STEPS.map((step, i) => (
            <li key={step.title}>
              <div className="flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:gap-6">
                <span className="font-display w-10 shrink-0 text-2xl leading-none text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1 space-y-1">
                  <h2 className="text-[14.5px] font-medium text-foreground">{step.title}</h2>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">{step.description}</p>
                </div>
                <Link
                  href={step.href}
                  className="group inline-flex shrink-0 items-center gap-1.5 self-start text-xs font-semibold uppercase tracking-wide text-primary sm:self-auto"
                >
                  {step.cta}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </div>
            </li>
          ))}
        </ol>

        <p className="border-t border-hairline pt-6 text-center text-[11px] leading-relaxed text-muted-foreground">
          Demonstrációs frontend – strukturált mock adatokkal működik, valós backenddel és LMS-sel később
          integrálható architektúrára építve.
        </p>
      </div>
    </div>
  );
}

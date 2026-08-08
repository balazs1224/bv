"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface DemoStep {
  title: string;
  duration: string;
  focus: string;
  href: string;
  /** Opcionális scenario/stage cél: ugyanazon route-on belül is valódi UI állapotot tud megnyitni. */
  scenarioId?: string;
  stageId?: string;
}

export const DEMO_STEPS: DemoStep[] = [
  {
    title: "A probléma",
    duration: "~30–40 mp",
    focus:
      "A szolgálati döntéshozatal nem szabályok bemagolása, hanem helyzetfüggő ítélőképesség. A tanulói dashboard mutatja: ez nem kvíz, hanem napi szolgálati helyzetekre épülő gyakorlótér.",
    href: "/",
  },
  {
    title: "Kompetenciamodell",
    duration: "~30 mp",
    focus:
      "Nyolc, egymásra épülő kompetencia egyetlen fejlődési láncban – nem nyolc külön lecke, hanem egy ív az észleléstől a komplex alkalmazásig.",
    href: "/kepzesek",
  },
  {
    title: "ESET 07 – helyzetfelismerés",
    duration: "~2 perc",
    focus:
      "Fotórealisztikus helyszín, valódi vizuális helyzetfelismerés és a korábbi döntésekből következő kockázati állapot.",
    href: "/szituacio/eset-07",
    scenarioId: "eset-07",
    stageId: "awareness",
  },
  {
    title: "ESET 07 – eredmény és reflexió",
    duration: "~45 mp",
    focus:
      "Nem csak a pontszám számít: mit ismert fel jól a tanuló, mely kockázatokat kezelte, mely kompetenciája fejlődött, és mi a következő ajánlott gyakorlat.",
    href: "/szituacio/eset-07",
    scenarioId: "eset-07",
    stageId: "result",
  },
  {
    title: "Kritikus pont – komplex alkalmazás",
    duration: "~45 mp",
    focus:
      "A záró komplex szituáció irányítótermi nézetből indul: több párhuzamos jelzés, korlátozott információ és priorizálási kényszer.",
    href: "/szituacio/muvelet-kritikus-pont",
    scenarioId: "muvelet-kritikus-pont",
    stageId: "brief",
  },
  {
    title: "Oktatói nézet",
    duration: "~30–45 mp",
    focus:
      "Az oktató nem csak pontszámokat lát, hanem azt is, mely döntési mintázatokban bizonytalan a tanuló – ez különbözteti meg egy hagyományos kvíz statisztikájától.",
    href: "/oktato",
  },
];

interface DemoModeState {
  active: boolean;
  stepIndex: number;
  step: DemoStep;
  isLast: boolean;
  isFirst: boolean;
  start: () => void;
  exit: () => void;
  goToStep: (index: number) => void;
  next: () => DemoStep | null;
  prev: () => DemoStep | null;
}

const DemoModeContext = createContext<DemoModeState | null>(null);

function routeStepIndex(pathname: string): number | null {
  if (pathname === "/") return 0;
  if (pathname.startsWith("/kepzesek")) return 1;
  if (pathname.startsWith("/szituacio/eset-07")) return 2;
  if (pathname.startsWith("/szituacio/muvelet-kritikus-pont")) return 4;
  if (pathname.startsWith("/oktato")) return 5;
  return null;
}

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  // Ha a felhasználó bemutató módban az alkalmazás saját navigációjával másik
  // bemutató-fejezetre lép, a banner ne maradjon egy korábbi lépésen.
  // Az ESET 07 két demo-lépése ugyanazon route-on van: ott csak akkor állítjuk
  // vissza a belépő (3.) lépésre, ha nem eleve a 3/4. lépés valamelyikén vagyunk.
  useEffect(() => {
    if (!active) return;
    const target = routeStepIndex(pathname);
    if (target === null) return;

    if (pathname.startsWith("/szituacio/eset-07")) {
      setStepIndex((current) => (current === 2 || current === 3 ? current : 2));
      return;
    }

    setStepIndex((current) => (current === target ? current : target));
  }, [active, pathname]);

  const value = useMemo<DemoModeState>(() => {
    const clamp = (i: number) => Math.min(Math.max(i, 0), DEMO_STEPS.length - 1);
    return {
      active,
      stepIndex,
      step: DEMO_STEPS[stepIndex],
      isLast: stepIndex === DEMO_STEPS.length - 1,
      isFirst: stepIndex === 0,
      start: () => {
        setStepIndex(0);
        setActive(true);
      },
      exit: () => setActive(false),
      goToStep: (index) => setStepIndex(clamp(index)),
      next: () => {
        if (stepIndex >= DEMO_STEPS.length - 1) return null;
        const target = DEMO_STEPS[stepIndex + 1];
        setStepIndex(stepIndex + 1);
        return target;
      },
      prev: () => {
        if (stepIndex <= 0) return null;
        const target = DEMO_STEPS[stepIndex - 1];
        setStepIndex(stepIndex - 1);
        return target;
      },
    };
  }, [active, stepIndex]);

  return <DemoModeContext.Provider value={value}>{children}</DemoModeContext.Provider>;
}

export function useDemoMode() {
  const ctx = useContext(DemoModeContext);
  if (!ctx) throw new Error("useDemoMode must be used within a DemoModeProvider");
  return ctx;
}

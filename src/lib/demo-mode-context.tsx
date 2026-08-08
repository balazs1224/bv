"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export interface DemoStep {
  title: string;
  duration: string;
  focus: string;
  href: string;
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
    title: "ESET 07 – gyorsított bejárás",
    duration: "~2 perc",
    focus:
      "Fotórealisztikus helyszín, helyszíni tudatossági feladat, indokolt döntési pont, élőben változó kockázati profil, majd egy kommunikációs döntés.",
    href: "/szituacio/eset-07",
  },
  {
    title: "Eredmény",
    duration: "~45 mp",
    focus:
      "Nem csak a pontszám számít: mit ismert fel jól a tanuló, mely kockázatokat kezelte, mely kompetenciája fejlődött, és mi a következő ajánlott gyakorlat.",
    href: "/szituacio/eset-07",
  },
  {
    title: "Kritikus pont – kitekintés",
    duration: "~45 mp",
    focus:
      "A záró komplex szituáció: az irányítótermi hero kép jelzi, hogy itt már nem egy izolált készség gyakorlása zajlik, hanem a teljes döntési modell összefonása.",
    href: "/szituacio/muvelet-kritikus-pont",
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

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

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

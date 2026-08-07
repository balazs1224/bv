import type { Scenario } from "@/lib/types";
import { ESET_07 } from "./eset07";
import { OTHER_SCENARIOS } from "./others";
import { MUVELET_KRITIKUS_PONT } from "./kritikuspont";

export const ALL_SCENARIOS: Scenario[] = [ESET_07, ...OTHER_SCENARIOS, MUVELET_KRITIKUS_PONT];

export function getScenarioById(id: string): Scenario | undefined {
  return ALL_SCENARIOS.find((s) => s.id === id);
}

export { ESET_07, OTHER_SCENARIOS, MUVELET_KRITIKUS_PONT };

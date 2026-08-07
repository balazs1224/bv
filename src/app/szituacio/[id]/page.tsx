import { notFound } from "next/navigation";
import { getScenarioById, ALL_SCENARIOS } from "@/lib/data/scenarios";
import { ScenarioRunner } from "@/components/scenario/scenario-runner";

export function generateStaticParams() {
  return ALL_SCENARIOS.map((s) => ({ id: s.id }));
}

export default async function SzituacioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const scenario = getScenarioById(id);
  if (!scenario) notFound();

  return <ScenarioRunner scenario={scenario} />;
}

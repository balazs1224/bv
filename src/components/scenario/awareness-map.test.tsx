import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AwarenessMap } from "@/components/scenario/awareness-map";
import type { Scenario, Stage } from "@/lib/types";

const scenario = {
  visual: {
    awareness: {
      src: "/scenarios/eset-07/awareness.webp",
      alt: "Helyzetfelismerési feladathoz tartozó helyszíni kép.",
      width: 1600,
      height: 900,
    },
  },
} as unknown as Scenario;

const stage = {
  id: "awareness",
  type: "awareness-map",
  title: "Helyszíni tudatosság",
  question: "Mit vennél észre a helyszínen?",
  awarenessMarkers: [
    { id: "m1", type: "point", x: 20, y: 30, category: "szemely", label: "Feldúlt fogvatartott", correct: true, note: "Note A" },
    { id: "m2", type: "point", x: 60, y: 45, category: "kamera", label: "CCTV kamera", correct: true, note: "Note B" },
    { id: "m3", type: "area", x: 10, y: 10, width: 20, height: 15, category: "tavolsag", label: "Biztonságos távolság", correct: true, note: "Note C" },
  ],
} as unknown as Stage;

describe("AwarenessMap", () => {
  it("toggles a point hotspot and updates the found count", async () => {
    const user = userEvent.setup();
    render(<AwarenessMap scenario={scenario} stage={stage} onContinue={vi.fn()} />);

    const pointHotspot = screen.getByRole("button", { name: "1. jelölhető pont a helyszínen" });
    expect(pointHotspot).toHaveAttribute("aria-pressed", "false");

    await user.click(pointHotspot);

    expect(pointHotspot).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Azonosított elemek (1/3)")).toBeInTheDocument();
  });

  it("toggles an area hotspot independently of point hotspots", async () => {
    const user = userEvent.setup();
    render(<AwarenessMap scenario={scenario} stage={stage} onContinue={vi.fn()} />);

    const areaHotspot = screen.getByRole("button", { name: "3. jelölhető pont a helyszínen" });
    expect(areaHotspot).toHaveAttribute("aria-pressed", "false");

    await user.click(areaHotspot);

    expect(areaHotspot).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "1. jelölhető pont a helyszínen" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("does not reveal the marker category before it is found", () => {
    render(<AwarenessMap scenario={scenario} stage={stage} onContinue={vi.fn()} />);
    expect(screen.queryByText("Feldúlt fogvatartott")).not.toBeInTheDocument();
    expect(screen.queryByText("CCTV kamera")).not.toBeInTheDocument();
  });

  it("enables continuing only once the minimum number of markers is found, then reports the result", async () => {
    const user = userEvent.setup();
    const onContinue = vi.fn();
    render(<AwarenessMap scenario={scenario} stage={stage} onContinue={onContinue} />);

    const continueButton = screen.getByRole("button", { name: "Tovább" });
    expect(continueButton).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "1. jelölhető pont a helyszínen" }));
    await user.click(screen.getByRole("button", { name: "2. jelölhető pont a helyszínen" }));
    await user.click(screen.getByRole("button", { name: "3. jelölhető pont a helyszínen" }));

    expect(continueButton).toBeEnabled();
    await user.click(continueButton);
    expect(onContinue).toHaveBeenCalledWith({ found: 3, total: 3 });
  });

  it("lets a marker be toggled from the sequential accessible list via the keyboard", async () => {
    const user = userEvent.setup();
    render(<AwarenessMap scenario={scenario} stage={stage} onContinue={vi.fn()} />);

    const list = screen.getByRole("list");
    const listButtons = within(list).getAllByRole("button");
    expect(listButtons).toHaveLength(3);

    listButtons[0].focus();
    expect(listButtons[0]).toHaveFocus();

    await user.keyboard("{Enter}");

    expect(listButtons[0]).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByRole("button", { name: "1. jelölhető pont a helyszínen" })).not.toBeInTheDocument();
  });
});

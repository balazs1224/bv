import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { useDebugHotspots } from "@/lib/use-debug-hotspots";

function Probe() {
  const enabled = useDebugHotspots();
  return <span>debug:{String(enabled)}</span>;
}

afterEach(() => {
  vi.unstubAllEnvs();
  window.history.pushState({}, "", "/");
});

describe("useDebugHotspots", () => {
  it("enables calibration mode outside production when the query flag is set", async () => {
    vi.stubEnv("NODE_ENV", "development");
    window.history.pushState({}, "", "/szituacio/eset-07?debugHotspots=1");

    render(<Probe />);

    expect(await screen.findByText("debug:true")).toBeInTheDocument();
  });

  it("stays disabled outside production when the query flag is absent", async () => {
    vi.stubEnv("NODE_ENV", "development");
    window.history.pushState({}, "", "/szituacio/eset-07");

    render(<Probe />);

    expect(await screen.findByText("debug:false")).toBeInTheDocument();
  });

  it("never enables in production, even with the query flag set", async () => {
    vi.stubEnv("NODE_ENV", "production");
    window.history.pushState({}, "", "/szituacio/eset-07?debugHotspots=1");

    render(<Probe />);

    expect(await screen.findByText("debug:false")).toBeInTheDocument();
  });
});

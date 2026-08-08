"use client";

import { useEffect, useState } from "react";

/**
 * Csak development környezetben, és csak ?debugHotspots=1 query paraméterrel aktiválódik.
 * Production build-ben a `process.env.NODE_ENV === "production"` ág build időben
 * konstansként dől el, így a debug logika ténylegesen ki is esik a bundle-ből.
 */
export function useDebugHotspots() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const params = new URLSearchParams(window.location.search);
    setEnabled(params.get("debugHotspots") === "1");
  }, []);

  return enabled;
}

"use client";

import { FRIEDRICH } from "@entities/profile";
import JavelinStage from "./JavelinStage";

/**
 * Touch regions, as % of the artwork itself (2048 × 1468) – they follow the image,
 * not the stage, so they stay put at any panel size. Nudge them if the art changes.
 *  - head:    horns + head            → headpat line
 *  - special: chest                   → special-touch line
 *  - rest of the art                  → touch line
 */
const HOTSPOTS = {
  head:    { top: "27%", left: "44%",   width: "12%", height: "12%" },
  special: { top: "40%", left: "45%",   width: "10%", height: "8%"  },
} as const;

export default function FriedrichStage() {
  return (
    <JavelinStage
      character={FRIEDRICH}
      hotspots={HOTSPOTS}
      frame={{ aspect: 2048 / 1468, x: 0.5 }}
    />
  );
}

"use client";

import { LAFFEY } from "@entities/profile";
import JavelinStage from "./JavelinStage";

/**
 * Touch regions, as % of the artwork itself (762 × 1024) – they follow the image,
 * not the stage, so they stay put at any panel size. Nudge them if the art changes.
 *  - head:    ears + head            → headpat line
 *  - special: rabbit sleeve + lamp   → special-touch line
 *  - rest of the art                 → touch line
 */
const HOTSPOTS = {
  head:    { top: "2%",  left: "35%", width: "31%", height: "26%" },
  special: { top: "42%", left: "29%", width: "25%", height: "11%" },
} as const;

export default function LaffeyStage() {
  return (
    <JavelinStage
      character={LAFFEY}
      hotspots={HOTSPOTS}
      frame={{ aspect: 762 / 1024, x: 0.5 }}
    />
  );
}

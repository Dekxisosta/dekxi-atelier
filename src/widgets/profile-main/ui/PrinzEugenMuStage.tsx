"use client";

import { PRINZ_EUGEN_MU } from "@entities/profile";
import JavelinStage from "./JavelinStage";

/**
 * Touch regions, as % of the artwork itself (1817 × 2048) – they follow the image,
 * not the stage, so they stay put at any panel size. Nudge them if the art changes.
 *  - head:    horns + hair + face   → headpat line
 *  - special: midriff / waist       → special-touch line
 *  - rest of the art                → touch line
 */
const HOTSPOTS = {
  head:    { top: "24.5%", left: "48.5%", width: "11%", height: "11%" },
  special: { top: "35%",   left: "50.5%", width: "10%", height: "8%"  },
} as const;

export default function PrinzEugenMuStage() {
  return (
    <JavelinStage
      character={PRINZ_EUGEN_MU}
      hotspots={HOTSPOTS}
      soundKey="prinz-eugen-mu-sound"
      frame={{ aspect: 1817 / 2048, x: 0.5 }}
    />
  );
}

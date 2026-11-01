"use client";

import { useIsMobile } from "@shared/hooks";

const WORD = "DEKXI-ATELIER";
const ROWS = 24;
/** One copy of the repeated word; the track holds two copies so the loop is seamless. */
const GROUP = Array.from({ length: 10 }, () => WORD).join("  \u2726  ");

/**
 * Diagonal rows of the site name sliding along the empty sides of the centered character page.
 * Only shown on the tablet home page: it is not rendered on phones, and the desktop layout has no empty sides.
 */
export default function SideTexture({ active }: { active: boolean }) {
  const isMobile = useIsMobile();
  if (!active || isMobile) return null;

  const rows = Array.from({ length: ROWS }, (_, i) => i);
  const field = (side: "left" | "right") => (
    <div className={`side-texture__side side-texture__side--${side}`}>
      <div className="side-texture__field">
        {rows.map((i) => (
          <div key={i} className="side-texture__row">
            <div className="side-texture__track">
              <span>{GROUP}</span>
              <span>{GROUP}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="side-texture" aria-hidden="true">
      {field("left")}
      {field("right")}
    </div>
  );
}

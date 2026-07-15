"use client";

import { useState } from "react";
import { CHIBI_IMAGES } from "@/lib/data/chibi";

export default function ChibiDock() {
  const [hovered, setHovered] = useState<{ label: string; x: number; y: number } | null>(null);

  return (
    <div className="chibi-dock">
      {CHIBI_IMAGES.map((chibi) => (
        <div
          key={chibi.id}
          className="chibi-item"
          onMouseEnter={(e) => setHovered({ label: chibi.label, x: e.clientX, y: e.clientY })}
          onMouseMove={(e) =>
            setHovered((h) => (h ? { ...h, x: e.clientX, y: e.clientY } : h))
          }
          onMouseLeave={() => setHovered(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={chibi.src} alt={chibi.label} />
        </div>
      ))}

      {hovered && (
        <div className="chibi-tooltip" style={{ left: hovered.x + 16, top: hovered.y + 16 }}>
          {hovered.label}
        </div>
      )}
    </div>
  );
}
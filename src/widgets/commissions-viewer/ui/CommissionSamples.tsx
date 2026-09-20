"use client";

import { useState, useEffect, useCallback } from "react";
import type { CommissionSample } from "@entities/commission";

export default function CommissionSamples({ samples }: { samples: CommissionSample[] }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<CommissionSample | null>(null);

  const close = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, close]);

  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  if (samples.length === 0) {
    return (
      <div className="commission-samples-empty">
        <ion-icon name="image-outline" />
        <span>Samples coming soon.</span>
      </div>
    );
  }

  // Only render the active card ± 2 neighbours; map each to a slot -2…+2
  const slots = [-2, -1, 0, 1, 2];

  return (
    <>
      <div className="commission-samples-wrap">
        <div className="commission-card-fan">
          {slots.map((offset) => {
            const idx = active + offset;
            if (idx < 0 || idx >= samples.length) return null;
            const sample   = samples[idx];
            const isActive = offset === 0;

            return (
              <button
                key={sample.id}
                className={`commission-sample-card commission-sample-card--${offset < 0 ? "l" : offset > 0 ? "r" : "c"}${Math.abs(offset)}${isActive ? " is-active" : ""}`}
                onClick={() => isActive ? setLightbox(sample) : setActive(idx)}
                aria-label={isActive ? `Expand: ${sample.alt}` : `View: ${sample.alt}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={sample.src} alt={sample.alt} draggable={false} />
                {sample.caption && isActive && (
                  <span className="commission-sample-card-caption">{sample.caption}</span>
                )}
                {isActive && (
                  <span className="commission-sample-card-zoom">
                    <ion-icon name="expand-outline" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* no dot nav */}
      </div>

      {lightbox && (
        <div
          className="commission-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt}
          onClick={close}
        >
          <button className="commission-lightbox-close" onClick={close} aria-label="Close">
            <ion-icon name="close-outline" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            className="commission-lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
          {lightbox.caption && (
            <p className="commission-lightbox-caption" onClick={(e) => e.stopPropagation()}>
              {lightbox.caption}
            </p>
          )}
        </div>
      )}
    </>
  );
}

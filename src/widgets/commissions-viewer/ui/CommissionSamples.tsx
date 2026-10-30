"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { CommissionSample } from "@entities/commission";

export default function CommissionSamples({ samples }: { samples: CommissionSample[] }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<CommissionSample | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const close = useCallback(() => setLightbox(null), []);
  const count = samples.length;

  /* Scroll the track to a slide (native scroll-snap handles the rest) */
  const goTo = useCallback(
    (i: number) => {
      const track = trackRef.current;
      if (!track || count === 0) return;
      const next = (i + count) % count;
      track.scrollTo({ left: next * track.clientWidth, behavior: "smooth" });
      setActive(next);
    },
    [count]
  );

  /* Keep `active` in sync when the user swipes / drags the track */
  const onScroll = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const track = trackRef.current;
      if (!track || track.clientWidth === 0) return;
      setActive(Math.round(track.scrollLeft / track.clientWidth));
    });
  }, []);

  useEffect(() => () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); }, []);

  /* Keep the active thumbnail visible inside the thumb strip */
  useEffect(() => {
    const strip = thumbsRef.current;
    const thumb = strip?.children[active] as HTMLElement | undefined;
    if (!strip || !thumb) return;
    const left = thumb.offsetLeft - strip.clientWidth / 2 + thumb.clientWidth / 2;
    strip.scrollTo({ left, behavior: "smooth" });
  }, [active]);

  /* Lightbox: Esc closes, arrows navigate */
  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const idx = samples.findIndex((s) => s.id === lightbox.id);
        const next = (idx + (e.key === "ArrowRight" ? 1 : -1) + count) % count;
        setLightbox(samples[next]);
        goTo(next);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, close, samples, count, goTo]);

  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  if (count === 0) {
    return (
      <div className="commission-samples-empty">
        <ion-icon name="image-outline" />
        <span>Samples coming soon.</span>
      </div>
    );
  }

  return (
    <>
      <section className="commission-carousel" aria-roledescription="carousel" aria-label="Commission samples">
        <div
          className="commission-carousel-viewport"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft")  { e.preventDefault(); goTo(active - 1); }
            if (e.key === "ArrowRight") { e.preventDefault(); goTo(active + 1); }
          }}
        >
          <div className="commission-carousel-track" ref={trackRef} onScroll={onScroll}>
            {samples.map((sample, i) => (
              <figure
                key={sample.id}
                className="commission-carousel-slide"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}`}
              >
                <button
                  type="button"
                  className="commission-carousel-img-btn"
                  onClick={() => setLightbox(sample)}
                  aria-label={`Expand: ${sample.alt}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sample.src}
                    alt={sample.alt}
                    draggable={false}
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                  <span className="commission-carousel-zoom">
                    <ion-icon name="expand-outline" />
                  </span>
                </button>
              </figure>
            ))}
          </div>

          {count > 1 && (
            <>
              <button
                type="button"
                className="commission-carousel-nav commission-carousel-nav--prev"
                onClick={() => goTo(active - 1)}
                aria-label="Previous sample"
              >
                <ion-icon name="chevron-back-outline" />
              </button>
              <button
                type="button"
                className="commission-carousel-nav commission-carousel-nav--next"
                onClick={() => goTo(active + 1)}
                aria-label="Next sample"
              >
                <ion-icon name="chevron-forward-outline" />
              </button>
            </>
          )}
        </div>

        {count > 1 && (
          <>
            <div className="commission-carousel-counter" aria-live="polite">
              {active + 1} / {count}
            </div>
            <div className="commission-carousel-thumbs" ref={thumbsRef}>
              {samples.map((sample, i) => (
                <button
                  key={sample.id}
                  type="button"
                  className={`commission-carousel-thumb${i === active ? " is-active" : ""}`}
                  onClick={() => goTo(i)}
                  aria-label={`Go to sample ${i + 1}`}
                  aria-current={i === active}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={sample.src} alt="" loading="lazy" draggable={false} />
                </button>
              ))}
            </div>
          </>
        )}
      </section>

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
        </div>
      )}
    </>
  );
}

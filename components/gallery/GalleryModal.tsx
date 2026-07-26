"use client";

import { useEffect, useCallback } from "react";
import type { GalleryItem } from "@/lib/supabase/gallery";

type GalleryModalProps = {
  items: GalleryItem[];
  activeIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
};

export default function GalleryModal({ items, activeIndex, onClose, onNext, onPrev }: GalleryModalProps) {
  const item = items[activeIndex];
  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex < items.length - 1;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && hasNext) onNext();
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
    },
    [onClose, onNext, onPrev, hasNext, hasPrev]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  if (!item) return null;

  return (
    <div className="gallery-modal-backdrop" onClick={onClose}>
      <div className="gallery-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="gallery-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <ion-icon name="close"></ion-icon>
        </button>

        {hasPrev && (
          <button
            type="button"
            className="gallery-modal-nav gallery-modal-nav-prev"
            onClick={onPrev}
            aria-label="Previous image"
          >
            <ion-icon name="chevron-back"></ion-icon>
          </button>
        )}

        <div className="gallery-modal-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image_url} alt={item.caption ?? ""} />
        </div>

        {item.caption && (
          <div className="gallery-modal-caption">
            <p>{item.caption}</p>
          </div>
        )}

        {hasNext && (
          <button
            type="button"
            className="gallery-modal-nav gallery-modal-nav-next"
            onClick={onNext}
            aria-label="Next image"
          >
            <ion-icon name="chevron-forward"></ion-icon>
          </button>
        )}
      </div>
    </div>
  );
}
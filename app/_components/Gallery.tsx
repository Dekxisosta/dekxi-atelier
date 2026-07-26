"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchGalleryItems, type GalleryItem } from "@/lib/supabase/gallery";
import { galleryTestData } from "@/lib/data/gallery-test-data";
import GalleryModal from "@/components/gallery/GalleryModal";

const USE_TEST_DATA = process.env.NEXT_PUBLIC_USE_GALLERY_TEST_DATA === "true";

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (USE_TEST_DATA) {
      setItems(galleryTestData);
      setLoading(false);
      return;
    }

    let cancelled = false;
    fetchGalleryItems().then((data) => {
      if (!cancelled) {
        setItems(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const openAt = useCallback((index: number) => setActiveIndex(index), []);
  const close = useCallback(() => setActiveIndex(null), []);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : Math.min(i + 1, items.length - 1)));
  }, [items.length]);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : Math.max(i - 1, 0)));
  }, []);

  if (loading) {
    return <div className="gallery-loading">Loading gallery…</div>;
  }

  if (items.length === 0) {
    return <div className="gallery-empty">No gallery items yet.</div>;
  }

  return (
    <>
      <div className="gallery-grid">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className="gallery-grid-item"
            onClick={() => openAt(index)}
            aria-label={item.caption ?? "View image"}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image_url}
              alt={item.caption ?? ""}
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <GalleryModal
          items={items}
          activeIndex={activeIndex}
          onClose={close}
          onNext={goNext}
          onPrev={goPrev}
        />
      )}
    </>
  );
}
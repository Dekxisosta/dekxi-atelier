"use client";

import { GalleryImage } from "@/lib/supabase/admin-types";

type Props = {
  images: GalleryImage[];
  onOpen: (img: GalleryImage) => void;
};

export default function GalleryGrid({ images, onOpen }: Props) {
  if (images.length === 0) {
    return <p>No pieces posted yet.</p>;
  }

  return (
    <div className="gallery-grid">
      {images.map((img) => (
        <button
          key={img.id}
          type="button"
          className="gallery-grid-cell"
          onClick={() => onOpen(img)}
          aria-label={img.caption || "Gallery image"}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img.image_url} alt={img.caption || ""} className="gallery-grid-img" />
          {img.caption && (
            <div className="gallery-grid-overlay">
              <span>{img.caption}</span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
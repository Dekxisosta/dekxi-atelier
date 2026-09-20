"use client";

import type { GalleryImage } from "@entities/gallery-image";

type Props = {
  images: GalleryImage[];
  onOpen: (img: GalleryImage) => void;
};

export default function AdminGalleryGrid({ images, onOpen }: Props) {
  if (images.length === 0) {
    return <p>No pieces posted yet.</p>;
  }

  return (
    <div className="admin-gallery-grid">
      {images.map((img) => (
        <button
          key={img.id}
          type="button"
          className="admin-gallery-cell"
          onClick={() => onOpen(img)}
          aria-label={img.caption || "Gallery image"}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.image_url}
            alt={img.caption || ""}
            className="admin-gallery-img"
          />
          {img.caption && (
            <div className="admin-gallery-overlay">
              <span>{img.caption}</span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

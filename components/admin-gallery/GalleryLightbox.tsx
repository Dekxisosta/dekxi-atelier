"use client";

import { GalleryImage } from "@/lib/supabase/admin-types";

type Props = {
  image: GalleryImage | null;
  onClose: () => void;
  onDelete: (img: GalleryImage) => void;
};

export default function GalleryLightbox({ image, onClose, onDelete }: Props) {
  if (!image) return null;

  return (
    <div className="gallery-lightbox-backdrop" onClick={onClose}>
      <div className="gallery-lightbox" onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.image_url} alt={image.caption || ""} className="gallery-lightbox-img" />
        <div className="gallery-lightbox-footer">
          <p className="gallery-lightbox-caption">{image.caption || <em>No caption</em>}</p>
          <div className="admin-form-actions">
            <button
              className="admin-btn admin-btn-small admin-btn-danger"
              onClick={() => onDelete(image)}
            >
              Delete
            </button>
            <button className="admin-btn admin-btn-small admin-btn-ghost" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
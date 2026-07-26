"use client";

import { GalleryImage } from "@/lib/supabase/admin-types";

type Props = {
  image: GalleryImage | null;
  onClose: () => void;
  onDelete: (img: GalleryImage) => void;
};

export default function AdminGalleryLightbox({ image, onClose, onDelete }: Props) {
  if (!image) return null;

  return (
    <div className="admin-gallery-lightbox-backdrop" onClick={onClose}>
      <div className="admin-gallery-lightbox" onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.image_url} alt={image.caption || ""} className="admin-gallery-lightbox-img" />
        <div className="admin-gallery-lightbox-footer">
          <p className="admin-gallery-lightbox-caption">{image.caption || <em>No caption</em>}</p>
          {image.description && (
            <p className="admin-gallery-lightbox-description">{image.description}</p>
          )}
          {image.location && (
            <p className="admin-gallery-lightbox-location">📍 {image.location}</p>
          )}
          {image.tags.length > 0 && (
            <div className="admin-gallery-lightbox-tags">
              {image.tags.map((tag) => (
                <span key={tag} className="admin-gallery-lightbox-tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}
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
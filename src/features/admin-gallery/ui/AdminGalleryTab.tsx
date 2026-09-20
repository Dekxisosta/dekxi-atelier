"use client";

import { useEffect, useState } from "react";
import { createClient } from "@shared/supabase/client";
import { extractStoragePath } from "@shared/supabase/storage-utils";
import type { GalleryImage } from "@entities/gallery-image";
import AdminGalleryUploadForm from "./AdminGalleryUploadForm";
import AdminGalleryGrid from "./AdminGalleryGrid";
import AdminGalleryLightbox from "./AdminGalleryLightbox";

const GALLERY_BUCKET = "site-images";
const GALLERY_FOLDER = "gallery";

export default function AdminGalleryTab() {
  const supabase = createClient();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [openImage, setOpenImage] = useState<GalleryImage | null>(null);

  async function loadImages() {
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setImages(data || []);
  }

  useEffect(() => {
    loadImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleUpload(
    file: File,
    fields: { caption: string; description: string; location: string; tags: string[] }
  ) {
    setUploading(true);
    const path = `${GALLERY_FOLDER}/${crypto.randomUUID()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from(GALLERY_BUCKET)
      .upload(path, file);
    if (uploadError) {
      alert("Upload failed: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from(GALLERY_BUCKET).getPublicUrl(path);

    const { error: insertError } = await supabase.from("gallery_images").insert({
      image_url: data.publicUrl,
      storage_path: path,
      caption: fields.caption || null,
      description: fields.description || null,
      location: fields.location || null,
      tags: fields.tags,
    });

    if (insertError) {
      alert("Save failed: " + insertError.message);
      await supabase.storage.from(GALLERY_BUCKET).remove([path]);
      setUploading(false);
      return;
    }

    setUploading(false);
    loadImages();
  }

  async function handleDelete(img: GalleryImage) {
    if (!confirm("Delete this piece from the gallery?")) return;

    const path =
      img.storage_path || extractStoragePath(img.image_url, GALLERY_BUCKET);
    if (path) {
      const { error: removeError } = await supabase.storage
        .from(GALLERY_BUCKET)
        .remove([path]);
      if (removeError)
        console.error("Failed to remove gallery image:", removeError.message);
    }

    const { error } = await supabase
      .from("gallery_images")
      .delete()
      .eq("id", img.id);
    if (error) {
      alert("Delete failed: " + error.message);
      return;
    }

    setOpenImage(null);
    loadImages();
  }

  return (
    <section className="admin-tab-panel">
      <div className="admin-columns">
        <div className="admin-column">
          <h2 className="admin-section-title">Add to Art Gallery</h2>
          <AdminGalleryUploadForm uploading={uploading} onUpload={handleUpload} />
        </div>

        <div className="admin-column">
          <h2 className="admin-section-title">Gallery</h2>
          <AdminGalleryGrid images={images} onOpen={setOpenImage} />
        </div>
      </div>

      <AdminGalleryLightbox
        image={openImage}
        onClose={() => setOpenImage(null)}
        onDelete={handleDelete}
      />
    </section>
  );
}

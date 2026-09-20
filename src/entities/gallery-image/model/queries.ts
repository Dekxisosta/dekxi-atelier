import { createClient } from "@shared/supabase/client";
import type { GalleryImage } from "./types";

export async function fetchGalleryItems(): Promise<GalleryImage[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("gallery_images")
    .select(
      "id, image_url, storage_path, caption, description, location, tags, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch gallery items:", error.message);
    return [];
  }
  return data ?? [];
}

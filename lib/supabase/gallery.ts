import { createClient } from "@/lib/supabase/client";

export type GalleryItem = {
  id: string;
  image_url: string;
  storage_path: string;
  caption: string | null;
  created_at: string;
};

export async function fetchGalleryItems(): Promise<GalleryItem[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("gallery_images")
    .select("id, image_url, storage_path, caption, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch gallery items:", error.message);
    return [];
  }

  return data ?? [];
}
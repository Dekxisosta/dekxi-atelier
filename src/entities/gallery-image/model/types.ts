export type GalleryImage = {
  id: string;
  image_url: string;
  storage_path: string;
  caption: string | null;
  description: string | null;
  location: string | null;
  tags: string[];
  created_at: string;
};

// Alias used by gallery viewer (same shape, different name convention)
export type GalleryItem = GalleryImage;

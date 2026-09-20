// Public API for the gallery-image entity
// NOTE: fetchGalleryItems uses the browser Supabase client so it IS safe for
// client bundles, but galleryTestData is also client-safe. Both are kept here.
export type { GalleryImage, GalleryItem } from "./model/types";
export { fetchGalleryItems } from "./model/queries";
export { galleryTestData } from "./model/test-data";

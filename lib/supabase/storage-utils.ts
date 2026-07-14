/**
 * Given a Supabase public storage URL and the bucket it belongs to,
 * return the path inside the bucket (e.g. "friend-avatars/abc123.png"),
 * or null if the URL doesn't match that bucket (e.g. a manually pasted
 * external URL, which we should never try to delete).
 */
export function extractStoragePath(url: string, bucket: string): string | null {
  const marker = `/public/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}
 
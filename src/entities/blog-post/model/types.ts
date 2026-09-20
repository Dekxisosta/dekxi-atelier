export type Attachment = { name: string; url: string; path: string };

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string | null;
  tag: string;
  published_at: string;
  cover_image_url: string | null;
  attachments: Attachment[] | null;
};

// ── Admin form helpers ─────────────────────────────────────────────────────
export const emptyBlogForm = {
  id: "",
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  tag: "",
  cover_image_url: "",
  attachments: [] as Attachment[],
};

export type BlogFormState = typeof emptyBlogForm;

// Static sidebar preview entries (not from Supabase)
export const LATEST_BLOGS = [
  { title: "Building an ornate linktree with Next.js", href: "#", date: "Jul 2026" },
  { title: "Roblox Studio notes: tweening tricks", href: "#", date: "Jun 2026" },
  { title: "Designing UI that feels handmade", href: "#", date: "Jun 2026" },
];

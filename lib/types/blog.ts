export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string | null;
  tag: string;
  published_at: string;
  cover_image_url: string | null;
  attachments: { name: string; url: string; path: string }[] | null;
};
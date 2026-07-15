import { createClient } from "@/lib/supabase/server";
import type { BlogPost } from "@/lib/types/blog";

export async function getPosts(): Promise<BlogPost[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Failed to load blog posts from Supabase:", error.message);
    return [];
  }
  return data || [];
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data;
}
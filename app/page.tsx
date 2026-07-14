import { createClient } from "@/lib/supabase/server";
import HomeClient from "./HomeClient";
import { DEFAULT_TAB, isTab } from "./tabs";

export const dynamic = "force-dynamic";

export type Friend = {
  id: string;
  friend_name: string;
  friend_profile_picture_link: string;
  friend_cover_link: string | null;
  friend_frame_link: string | null;
  friend_description: string | null;
  friend_tags: string[] | null;
  friend_links: { name: string; url: string }[] | null;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  published_at: string;
  cover_image_url: string | null;
};

// Fisher-Yates, run server-side per request so the shuffle can't be seen
// or replayed by inspecting client JS.
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function getFriends(): Promise<Friend[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("friends").select("*");
  if (error) {
    console.error("Failed to load friends from Supabase:", error.message);
    return [];
  }
  return shuffle(data || []);
}

async function getPosts(): Promise<BlogPost[]> {
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

type PageProps = {
  // Typed as a Promise for Next.js 15+ compatibility (searchParams is
  // async there). Awaiting a plain object also works fine at runtime
  // on older versions, so this is safe either way.
  searchParams: Promise<{ tab?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
  // Both run once, in parallel, on the server for this request.
  // HomeClient (and its children) receive the results as props and
  // never re-fetch when the user switches tabs client-side.
  const [friends, posts, params] = await Promise.all([
    getFriends(),
    getPosts(),
    searchParams
  ]);

  const initialTab = isTab(params.tab) ? params.tab : DEFAULT_TAB;

  return <HomeClient friends={friends} posts={posts} initialTab={initialTab} />;
}
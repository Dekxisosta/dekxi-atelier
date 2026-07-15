import HomeClient from "./_components/HomeClient";
import { DEFAULT_TAB, isTab } from "@/lib/tabs";
import { getFriends } from "@/lib/queries/friends";
import { getPosts } from "@/lib/queries/posts";

export const dynamic = "force-dynamic";

export type { Friend } from "@/lib/types/friend";
export type { BlogPost } from "@/lib/types/blog";

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
import { HomeClient } from "@views/home";
import { DEFAULT_TAB, isTab } from "@shared/config/tabs";
import { getFriends } from "@entities/friend/model/queries";
import { getPosts } from "@entities/blog-post/model/queries";
import { COMMISSION_INFO } from "@entities/commission";

export const dynamic = "force-dynamic";

// Re-export domain types for any co-located files that historically
// imported them from here (backwards-compat; ideally import from entities directly).
export type { Friend } from "@entities/friend";
export type { BlogPost } from "@entities/blog-post";

type PageProps = {
  searchParams: Promise<{ tab?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
  const [friends, posts, params] = await Promise.all([
    getFriends(),
    getPosts(),
    searchParams,
  ]);

  const initialTab = isTab(params.tab) ? params.tab : DEFAULT_TAB;

  return (
    <HomeClient
      friends={friends}
      posts={posts}
      initialTab={initialTab}
      commissionInfo={COMMISSION_INFO}
    />
  );
}

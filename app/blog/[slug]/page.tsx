import { notFound } from "next/navigation";
import IdeHeader from "@/components/IdeHeader";
import BlogPostBackLink from "@/components/blog/BlogPostBackLink";
import BlogPostCover from "@/components/blog/BlogPostCover";
import BlogPostArticle from "@/components/blog/BlogPostArticle";
import { getPostBySlug } from "@/lib/queries/posts";

export const dynamic = "force-dynamic";

type PageProps = {
  // Typed as a Promise for Next.js 15+ compatibility, matching the
  // searchParams pattern on the homepage.
  params: Promise<{ slug: string }>;
};

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="container-page">
      <div className="bg-decor"></div>
      <div className="container-main-decor-fur">
        <div className="container-main-decor">
          <IdeHeader />
          <BlogPostBackLink />
          {post.cover_image_url && <BlogPostCover src={post.cover_image_url} />}
          <BlogPostArticle post={post} />
        </div>
      </div>
    </div>
  );
}
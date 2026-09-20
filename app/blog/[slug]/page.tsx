import { notFound } from "next/navigation";
import { BlogPostPage } from "@views/blog-post";
import { getPostBySlug } from "@entities/blog-post/model/queries";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostRoute({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return <BlogPostPage post={post} />;
}

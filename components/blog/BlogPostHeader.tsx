import { formatDate } from "@/lib/utils/format-date";
import type { BlogPost } from "@/lib/types/blog";

export default function BlogPostHeader({ post }: { post: Pick<BlogPost, "published_at" | "tag" | "title" | "excerpt"> }) {
  return (
    <>
      <h1 className="blog-post-title">{post.title}</h1>
      <span className="blog-post-date">{formatDate(post.published_at)}</span>
      <br />
      <br />
      <p className="blog-post-excerpt">{post.excerpt}</p>
    </>
  );
}
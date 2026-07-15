import BlogPostHeader from "@/components/blog/BlogPostHeader";
import BlogPostContent from "@/components/blog/BlogPostContent";
import type { BlogPost } from "@/lib/types/blog";

export default function BlogPostArticle({ post }: { post: BlogPost }) {
  return (
    <article className="blog-post">
      <BlogPostHeader post={post} />
      {post.content && <BlogPostContent content={post.content} />}
    </article>
  );
}
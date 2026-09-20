import BlogPostHeader from "./BlogPostHeader";
import BlogPostContent from "./BlogPostContent";
import type { BlogPost } from "../model/types";

export default function BlogPostArticle({ post }: { post: BlogPost }) {
  return (
    <article className="blog-post">
      <BlogPostHeader post={post} />
      {post.content && <BlogPostContent content={post.content} />}
    </article>
  );
}

import Link from "next/link";
import { BlogPostCover, BlogPostArticle } from "@entities/blog-post";
import type { BlogPost } from "@entities/blog-post";

export default function BlogPostPage({ post }: { post: BlogPost }) {
  return (
    <div className="container-page">
      <div className="bg-decor" />
      <div className="container-main-decor-fur">
        <div className="container-main-decor">
          <Link href="/?tab=blog" className="blog-post-back">
            <ion-icon name="arrow-back-outline"></ion-icon>
            <span>back to blog log</span>
          </Link>
          {post.cover_image_url && <BlogPostCover src={post.cover_image_url} />}
          <BlogPostArticle post={post} />
        </div>
      </div>
    </div>
  );
}

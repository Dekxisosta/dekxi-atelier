import { formatDate } from "@/lib/utils/format-date";
import type { BlogPost } from "@/lib/types/blog";

export default function BlogEntryCard({ post }: { post: BlogPost }) {
  return (
    <article className="blog-entry blog-entry-grid">
      <div className="blog-entry-window">
        <div className="blog-entry-window-bar">
          <span className="blog-entry-window-dot" />
          <span className="blog-entry-window-dot" />
          <span className="blog-entry-window-dot" />
        </div>
        {post.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="blog-entry-window-thumb" src={post.cover_image_url} alt="" />
        ) : (
          <div className="blog-entry-window-thumb" style={{ background: "var(--bg-dark)" }} />
        )}
        <span className="blog-entry-window-caption">{post.slug}.md</span>
      </div>

      <div className="blog-entry-body">
        <div className="blog-entry-meta">
          <span className="blog-entry-date">{formatDate(post.published_at)}</span>
          <span className="blog-entry-tag">{post.tag}</span>
        </div>
        <h3 className="blog-entry-title">{post.title}</h3>
        <p className="blog-entry-excerpt">{post.excerpt}</p>
        <a className="blog-entry-link" href={`/blog/${post.slug}`}>
          read entry →
        </a>
      </div>
    </article>
  );
}
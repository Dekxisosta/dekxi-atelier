"use client";

import Link from "next/link";
import { formatDate } from "@shared/utils/format-date";
import type { BlogPost } from "../model/types";

type Props = {
  post: BlogPost;
  /** When provided, clicking opens the post in place instead of navigating. */
  onSelect?: (post: BlogPost) => void;
};

export default function BlogEntryCard({ post, onSelect }: Props) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="blog-entry blog-entry-grid"
      onClick={(e) => {
        if (!onSelect) return;
        // Let ctrl/cmd/shift/middle-click still open the standalone page.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        onSelect(post);
      }}
    >
      <article className="blog-entry-window">
        {post.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="blog-entry-window-thumb" src={post.cover_image_url} alt="" />
        ) : (
          <div className="blog-entry-window-thumb" style={{ background: "var(--bg-dark)" }} />
        )}
      </article>

      <div className="blog-entry-body">
        <div className="blog-entry-meta">
          <span className="blog-entry-date">{formatDate(post.published_at)}</span>
          <span className="blog-entry-tag">{post.tag}</span>
        </div>
        <h3 className="blog-entry-title">{post.title}</h3>
        <p className="blog-entry-excerpt">{post.excerpt}</p>
        <span className="blog-entry-link">read entry →</span>
      </div>
    </Link>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  BlogEntryCard,
  BlogPostArticle,
  BlogPostCover,
} from "@entities/blog-post";
import type { BlogPost } from "@entities/blog-post";

function syncUrl(slug: string | null) {
  const url = new URL(window.location.href);
  if (slug) url.searchParams.set("post", slug);
  else url.searchParams.delete("post");
  window.history.replaceState(null, "", url);
}

export default function BlogViewer({ posts }: { posts: BlogPost[] }) {
  const [selected, setSelected] = useState<BlogPost | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  // Restore an open post from ?post=slug (e.g. after a refresh).
  useEffect(() => {
    const slug = new URL(window.location.href).searchParams.get("post");
    if (slug) setSelected(posts.find((p) => p.slug === slug) ?? null);
  }, [posts]);

  const open = useCallback((post: BlogPost) => {
    setSelected(post);
    syncUrl(post.slug);
  }, []);

  const close = useCallback(() => {
    setSelected(null);
    syncUrl(null);
  }, []);

  // Jump to the top of the layout's scroll area when switching views.
  useEffect(() => {
    topRef.current?.scrollIntoView({ block: "start" });
  }, [selected]);

  return (
    <div className="friends-main" ref={topRef}>
      <div className="friends-content">
        {selected ? (
          <>
            <button type="button" className="blog-post-back" onClick={close}>
              <ion-icon name="arrow-back-outline"></ion-icon>
              <span>back to blog log</span>
            </button>
            {selected.cover_image_url && <BlogPostCover src={selected.cover_image_url} />}
            <BlogPostArticle post={selected} />
          </>
        ) : (
          <>
            <div className="blog-list blog-list-grid" id="blogList">
              {posts.length === 0 && <p>No entries yet.</p>}
              {posts.map((post) => (
                <BlogEntryCard key={post.id} post={post} onSelect={open} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

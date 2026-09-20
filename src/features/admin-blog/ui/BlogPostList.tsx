"use client";

import type { BlogPost } from "@entities/blog-post";

type Props = {
  posts: BlogPost[];
  onEdit: (p: BlogPost) => void;
  onDelete: (p: BlogPost) => void;
};

export default function BlogPostList({ posts, onEdit, onDelete }: Props) {
  return (
    <div className="admin-blog-posts">
      <h2 className="admin-section-title">Existing Posts</h2>
      <div className="admin-list">
        {posts.length === 0 && <p>No posts yet.</p>}
        {posts.map((p) => (
          <div className="admin-row" key={p.id}>
            {p.cover_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="admin-row-thumb" src={p.cover_image_url} alt="" />
            ) : (
              <div className="admin-row-thumb admin-row-thumb-empty" />
            )}
            <div className="admin-row-info">
              <strong>{p.title}</strong>
              <span>
                {p.slug} · {p.tag}
              </span>
            </div>
            <div className="admin-row-actions">
              <button className="admin-btn admin-btn-small" onClick={() => onEdit(p)}>
                Edit
              </button>
              <button
                className="admin-btn admin-btn-small admin-btn-danger"
                onClick={() => onDelete(p)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

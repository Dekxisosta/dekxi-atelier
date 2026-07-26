"use client";

import { useLockBodyScroll } from "@/lib/hooks/useLockBodyScroll";
import type { GalleryItem } from "@/lib/supabase/gallery";

// Single-owner gallery — swap in a real avatar path once you have one.
const OWNER_USERNAME = "dekxisosta";
const OWNER_AVATAR_URL: string | null = null;

type Props = {
  items: GalleryItem[];
  activeIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
}

export default function GalleryModal({ items, activeIndex, onClose, onNext, onPrev }: Props) {
  useLockBodyScroll(true);

  const item = items[activeIndex];
  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex < items.length - 1;
  const comments: { id: string; username: string; text: string; createdAt: string; likes: number }[] = [];

  return (
    <div className="gallery-modal-backdrop" onClick={onClose}>
      <div className="gallery-modal" onClick={(e) => e.stopPropagation()}>

        {hasPrev && (
          <button
            className="gallery-modal-nav gallery-modal-nav-prev"
            onClick={onPrev}
            aria-label="Previous image"
          >
            ‹
          </button>
        )}
        {hasNext && (
          <button
            className="gallery-modal-nav gallery-modal-nav-next"
            onClick={onNext}
            aria-label="Next image"
          >
            ›
          </button>
        )}

        <div className="gallery-modal-media-pane">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image_url} alt={item.caption ?? ""} />
        </div>

        <div className="gallery-modal-sidebar">
          <div className="gallery-modal-header">
            <div className="gallery-modal-avatar">
              {OWNER_AVATAR_URL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={OWNER_AVATAR_URL} alt={OWNER_USERNAME} />
              ) : (
                OWNER_USERNAME.slice(0, 2).toUpperCase()
              )}
            </div>
            <div className="gallery-modal-header-text">
              <span className="gallery-modal-username">{OWNER_USERNAME}</span>
              {item.location && <span className="gallery-modal-subtitle">{item.location}</span>}
            </div>
            <button className="gallery-modal-more" aria-label="More options">
              ⋯
            </button>
            <button className="gallery-modal-close-inline" onClick={onClose} aria-label="Close">
              <ion-icon name="close" />
            </button>
          </div>

          <div className="gallery-modal-scroll">
            {(item.caption || item.description || item.tags.length > 0) && (
              <div className="gallery-modal-caption-row">
                <div className="gallery-modal-avatar">
                  {OWNER_AVATAR_URL ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={OWNER_AVATAR_URL} alt={OWNER_USERNAME} />
                  ) : (
                    OWNER_USERNAME.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div>
                  <p className="gallery-modal-caption-text">
                    <span className="username">{OWNER_USERNAME}</span>
                    {item.caption}
                    {item.description ? ` — ${item.description}` : ""}
                  </p>
                  {item.tags.length > 0 && (
                    <div className="gallery-modal-tags">
                      {item.tags.map((tag) => (
                        <span key={tag} className="gallery-modal-tag">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <span className="gallery-modal-timestamp">{formatDate(item.created_at)}</span>
                </div>
              </div>
            )}

            <div className="gallery-modal-comments">
              {comments.length === 0 ? (
                <p className="gallery-modal-comments-empty">No comments yet.</p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="gallery-modal-comment">
                    <div className="gallery-modal-avatar">{c.username.slice(0, 2).toUpperCase()}</div>
                    <div className="gallery-modal-comment-body">
                      <p className="gallery-modal-comment-text">
                        <span className="username">{c.username}</span>
                        {c.text}
                      </p>
                      <div className="gallery-modal-comment-meta">
                        <span>{formatDate(c.createdAt)}</span>
                        <span>{c.likes} like{c.likes === 1 ? "" : "s"}</span>
                        <button type="button">Reply</button>
                      </div>
                    </div>
                    <button className="gallery-modal-comment-like" aria-label="Like comment">
                      ♡
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="gallery-modal-footer">
            <div className="gallery-modal-actions">
              <button type="button" aria-label="Like">
                <ion-icon name="heart-outline" />
              </button>
              <button type="button" aria-label="Comment">
                <ion-icon name="chatbubble-outline" />
              </button>
              <button type="button" aria-label="Share">
                <ion-icon name="paper-plane-outline" />
              </button>
              <button type="button" className="gallery-modal-action-bookmark" aria-label="Save">
                <ion-icon name="bookmark-outline" />
              </button>
            </div>

            <p className="gallery-modal-likes">
              Liked by <strong>...</strong>
            </p>
            <span className="gallery-modal-date">{formatDate(item.created_at)}</span>

            <form
              className="gallery-modal-comment-form"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <input
                type="text"
                className="gallery-modal-comment-input"
                placeholder="Add a comment..."
                disabled
              />
              <button type="submit" className="gallery-modal-comment-post" disabled>
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
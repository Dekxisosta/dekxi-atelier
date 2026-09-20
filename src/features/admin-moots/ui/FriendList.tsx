"use client";

import { useMemo, useState } from "react";
import type { Friend } from "@entities/friend";

type Props = {
  friends: Friend[];
  onEdit: (f: Friend) => void;
  onDelete: (f: Friend) => void;
};

const PAGE_SIZE = 10;

export default function FriendList({ friends, onEdit, onDelete }: Props) {
  const [page, setPage] = useState(0);

  const pageCount = Math.max(1, Math.ceil(friends.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);

  const visibleFriends = useMemo(() => {
    const start = safePage * PAGE_SIZE;
    return friends.slice(start, start + PAGE_SIZE);
  }, [friends, safePage]);

  return (
    <div className="admin-list">
      {friends.length === 0 && <p>No friends yet.</p>}

      {visibleFriends.map((f) => (
        <div className="admin-row" key={f.id}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="admin-row-avatar" src={f.friend_profile_picture_link} alt="" />
          <div className="admin-row-info">
            <strong>{f.friend_name}</strong>
            <span>{f.friend_description || ""}</span>
          </div>
          <div className="admin-row-actions">
            <button className="admin-btn admin-btn-small" onClick={() => onEdit(f)}>
              Edit
            </button>
            <button
              className="admin-btn admin-btn-small admin-btn-danger"
              onClick={() => onDelete(f)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {friends.length > PAGE_SIZE && (
        <div className="admin-pagination">
          <button
            type="button"
            className="admin-btn admin-btn-small admin-btn-ghost"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={safePage === 0}
          >
            Prev
          </button>
          <span className="admin-pagination-label">
            Page {safePage + 1} of {pageCount}
          </span>
          <button
            type="button"
            className="admin-btn admin-btn-small admin-btn-ghost"
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={safePage >= pageCount - 1}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

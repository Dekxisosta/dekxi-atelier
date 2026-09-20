"use client";

import { ImageUploader } from "@shared/ui";
import type { FriendFormState } from "@entities/friend";

const IMAGE_BUCKET = "site-images";
const FRAME_BUCKET = "profile-frames";

type Props = {
  form: FriendFormState;
  onChange: (next: FriendFormState) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

export default function FriendForm({ form, onChange, onSubmit, onCancel }: Props) {
  return (
    <form className="admin-form" onSubmit={onSubmit}>
      <label className="admin-label">Name</label>
      <input
        className="admin-input"
        required
        value={form.friend_name}
        onChange={(e) => onChange({ ...form, friend_name: e.target.value })}
      />

      <label className="admin-label">Description</label>
      <textarea
        className="admin-input"
        rows={2}
        value={form.friend_description}
        onChange={(e) => onChange({ ...form, friend_description: e.target.value })}
      />

      <ImageUploader
        bucket={IMAGE_BUCKET}
        folder="friend-avatars"
        label="Profile Picture"
        required
        previewShape="round"
        value={form.friend_profile_picture_link}
        onChange={(url) => onChange({ ...form, friend_profile_picture_link: url })}
      />

      <ImageUploader
        bucket={IMAGE_BUCKET}
        folder="friend-covers"
        label="Cover Image"
        value={form.friend_cover_link}
        onChange={(url) => onChange({ ...form, friend_cover_link: url })}
      />

      <ImageUploader
        bucket={FRAME_BUCKET}
        label="Profile Frame (overlay, optional)"
        previewShape="round"
        value={form.friend_frame_link}
        onChange={(url) => onChange({ ...form, friend_frame_link: url })}
      />

      <label className="admin-label">Tags (comma separated)</label>
      <input
        className="admin-input"
        placeholder="Artist, Arch Linux, ML/AI"
        value={form.friend_tags}
        onChange={(e) => onChange({ ...form, friend_tags: e.target.value })}
      />

      <label className="admin-label">Links (one per line: Name | URL)</label>
      <textarea
        className="admin-input"
        rows={3}
        placeholder={"GitHub | https://github.com/example\nTwitter | https://x.com/example"}
        value={form.friend_links}
        onChange={(e) => onChange({ ...form, friend_links: e.target.value })}
      />

      <div className="admin-form-actions">
        <button type="submit" className="admin-btn">
          {form.id ? "Save Changes" : "Add Friend"}
        </button>
        {form.id && (
          <button
            type="button"
            className="admin-btn admin-btn-ghost"
            onClick={onCancel}
          >
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
}

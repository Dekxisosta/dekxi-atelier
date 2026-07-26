"use client";

import { useState } from "react";

type Props = {
  uploading: boolean;
  onUpload: (
    file: File,
    fields: { caption: string; description: string; location: string; tags: string[] }
  ) => void;
};

export default function AdminGalleryUploadForm({ uploading, onUpload }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.files?.[0] || null;
    setFile(next);
    setPreview(next ? URL.createObjectURL(next) : null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    onUpload(file, {
      caption: caption.trim(),
      description: description.trim(),
      location: location.trim(),
      tags,
    });

    setFile(null);
    setPreview(null);
    setCaption("");
    setDescription("");
    setLocation("");
    setTagsInput("");
  }

  return (
    <form className="admin-form admin-gallery-upload-form" onSubmit={handleSubmit}>
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="" className="admin-gallery-upload-preview" />
      )}

      <label className="admin-label">Image</label>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      <label className="admin-label">Caption</label>
      <textarea
        className="admin-input"
        rows={2}
        placeholder="Say something about this piece..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />

      <label className="admin-label">Description</label>
      <textarea
        className="admin-input"
        rows={3}
        placeholder="Longer notes about the piece (process, inspiration, etc.)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label className="admin-label">Location</label>
      <input
        type="text"
        className="admin-input"
        placeholder="e.g. Cabuyao, Laguna"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <label className="admin-label">Tags</label>
      <input
        type="text"
        className="admin-input"
        placeholder="comma, separated, tags"
        value={tagsInput}
        onChange={(e) => setTagsInput(e.target.value)}
      />

      <div className="admin-form-actions">
        <button type="submit" className="admin-btn" disabled={!file || uploading}>
          {uploading ? "Uploading..." : "Post to Gallery"}
        </button>
      </div>
    </form>
  );
}
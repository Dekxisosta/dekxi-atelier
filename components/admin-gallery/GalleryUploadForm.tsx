"use client";

import { useState } from "react";

type Props = {
  uploading: boolean;
  onUpload: (file: File, caption: string) => void;
};

export default function GalleryUploadForm({ uploading, onUpload }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.files?.[0] || null;
    setFile(next);
    setPreview(next ? URL.createObjectURL(next) : null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    onUpload(file, caption.trim());
    setFile(null);
    setPreview(null);
    setCaption("");
  }

  return (
    <form className="admin-form gallery-upload-form" onSubmit={handleSubmit}>
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="" className="gallery-upload-preview" />
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

      <div className="admin-form-actions">
        <button type="submit" className="admin-btn" disabled={!file || uploading}>
          {uploading ? "Uploading..." : "Post to Gallery"}
        </button>
      </div>
    </form>
  );
}
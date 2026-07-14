"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { extractStoragePath } from "@/lib/supabase/storage-utils";

type ImageUploaderProps = {
  bucket: string;
  folder?: string;
  value: string;
  onChange: (url: string) => void;
  label: string;
  required?: boolean;
  previewShape?: "round" | "rect";
};

export default function ImageUploader({
  bucket,
  folder = "",
  value,
  onChange,
  label,
  required,
  previewShape = "rect"
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    // Clean up the file we're about to replace, if it lives in this bucket.
    if (value) {
      const oldPath = extractStoragePath(value, bucket);
      if (oldPath) {
        const { error: removeError } = await supabase.storage.from(bucket).remove([oldPath]);
        if (removeError) {
          console.error("Failed to remove old file:", removeError.message);
          // non-fatal — continue with the upload either way
        }
      }
    }

    const ext = file.name.split(".").pop();
    const path = folder
      ? `${folder}/${crypto.randomUUID()}.${ext}`
      : `${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: false
    });

    setUploading(false);
    e.target.value = "";

    if (error) {
      alert("Upload failed: " + error.message);
      return;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    onChange(data.publicUrl);
  }

  return (
    <div className="admin-image-uploader">
      <label className="admin-label">{label}</label>

      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={
            "admin-image-preview" +
            (previewShape === "round" ? " admin-image-preview-round" : "")
          }
          src={value}
          alt=""
        />
      )}

      <input
        className="admin-input"
        required={required}
        placeholder="Paste a URL, or upload a file below"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      <div className="admin-upload-row">
        <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
        {uploading && <span className="admin-upload-status">uploading...</span>}
      </div>
    </div>
  );
}
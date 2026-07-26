"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Attachment } from "@/lib/supabase/admin-types";

const IMAGE_BUCKET = "site-images";

type Props = {
  attachments: Attachment[];
  onChange: (next: Attachment[]) => void;
  onInsert: (att: Attachment) => void;
};

export default function AttachmentManager({ attachments, onChange, onInsert }: Props) {
  const supabase = createClient();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || !files.length) return;

    const uploaded: Attachment[] = [];
    for (const file of Array.from(files)) {
      const path = `blog-attachments/${crypto.randomUUID()}-${file.name}`;
      const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(path, file);
      if (error) {
        alert(`Upload failed for ${file.name}: ${error.message}`);
        continue;
      }
      const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
      uploaded.push({ name: file.name, url: data.publicUrl, path });
    }

    onChange([...attachments, ...uploaded]);
    e.target.value = "";
  }

  async function handleRemove(att: Attachment) {
    if (!confirm(`Remove ${att.name}? This deletes the file from storage.`)) return;

    const { error } = await supabase.storage.from(IMAGE_BUCKET).remove([att.path]);
    if (error) {
      alert("Remove failed: " + error.message);
      return;
    }

    onChange(attachments.filter((a) => a.path !== att.path));
  }

  function handleDragStart(index: number) {
    setDraggedIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault(); // required to allow drop
    if (index !== dragOverIndex) setDragOverIndex(index);
  }

  function handleDragEnd() {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }

  function handleDrop(e: React.DragEvent, dropIndex: number) {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      handleDragEnd();
      return;
    }
    const next = [...attachments];
    const [moved] = next.splice(draggedIndex, 1);
    next.splice(dropIndex, 0, moved);
    onChange(next);
    handleDragEnd();
  }

  return (
    <>
      <label className="admin-label">Attachments</label>
      <div className="attachments-bucket">
        <input type="file" multiple onChange={handleUpload} />
        <div className="attachments-list">
          {attachments.length === 0 && (
            <p style={{ fontSize: "11.5px", opacity: 0.6, fontStyle: "italic" }}>
              No attachments yet.
            </p>
          )}
          {attachments.map((att, index) => (
            <div
              className={
                "attachment-row" +
                (draggedIndex === index ? " attachment-row-dragging" : "") +
                (dragOverIndex === index && draggedIndex !== index
                  ? " attachment-row-dragover"
                  : "")
              }
              key={att.path}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
            >
              <span className="attachment-row-handle" aria-hidden="true">
                ⠿
              </span>
              <span className="attachment-row-name">{att.name}</span>
              <div className="attachment-row-actions">
                <button
                  type="button"
                  className="admin-btn admin-btn-small"
                  onClick={() => onInsert(att)}
                >
                  Insert
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn-small admin-btn-danger"
                  onClick={() => handleRemove(att)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
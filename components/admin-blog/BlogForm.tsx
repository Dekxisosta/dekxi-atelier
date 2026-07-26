"use client";

import { RefObject } from "react";
import ImageUploader from "@/components/ImageUploader";
import MarkdownEditor from "@/components/MarkdownEditor";
import { BlogFormState } from "@/lib/supabase/admin-types";

const IMAGE_BUCKET = "site-images";

type Props = {
  form: BlogFormState;
  onChange: (next: BlogFormState) => void;
  contentTextareaRef: RefObject<HTMLTextAreaElement>;
};

export default function BlogForm({ form, onChange, contentTextareaRef }: Props) {
  return (
    <>
      <div className="admin-blog-toplevel">
        <div>
          <label className="admin-label">Slug (unique, e.g. my-post-title)</label>
          <input
            className="admin-input"
            required
            value={form.slug}
            onChange={(e) => onChange({ ...form, slug: e.target.value })}
          />
        </div>

        <div>
          <label className="admin-label">Title</label>
          <input
            className="admin-input"
            required
            value={form.title}
            onChange={(e) => onChange({ ...form, title: e.target.value })}
          />
        </div>

        <div className="admin-blog-toplevel-full">
          <label className="admin-label">Excerpt</label>
          <textarea
            className="admin-input"
            rows={2}
            required
            value={form.excerpt}
            onChange={(e) => onChange({ ...form, excerpt: e.target.value })}
          />
        </div>

        <div className="admin-blog-toplevel-full">
          <ImageUploader
            bucket={IMAGE_BUCKET}
            folder="blog-covers"
            label="Cover Image"
            value={form.cover_image_url}
            onChange={(url) => onChange({ ...form, cover_image_url: url })}
          />
        </div>

        <div>
          <label className="admin-label">Tag</label>
          <input
            className="admin-input"
            placeholder="devlog"
            value={form.tag}
            onChange={(e) => onChange({ ...form, tag: e.target.value })}
          />
        </div>
      </div>

      <div className="admin-blog-content">
        <label className="admin-label">Content (Markdown)</label>
        <MarkdownEditor
          value={form.content}
          onChange={(v) => onChange({ ...form, content: v })}
          textareaRef={contentTextareaRef}
        />
      </div>
    </>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@shared/supabase/client";
import { extractStoragePath } from "@shared/supabase/storage-utils";
import { type BlogPost, type Attachment, emptyBlogForm } from "@entities/blog-post";
import BlogForm from "./BlogForm";
import AttachmentManager from "./AttachmentManager";
import BlogPostList from "./BlogPostList";

const IMAGE_BUCKET = "site-images";

export default function BlogTab() {
  const supabase = createClient();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [form, setForm] = useState(emptyBlogForm);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  async function loadPosts() {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("published_at", { ascending: false });
    if (!error) setPosts(data || []);
  }

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submitBlog(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      slug: form.slug.trim(),
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      content: form.content.trim(),
      tag: form.tag.trim(),
      cover_image_url: form.cover_image_url.trim(),
      attachments: form.attachments,
    };

    const { error } = form.id
      ? await supabase.from("blog_posts").update(payload).eq("id", form.id)
      : await supabase.from("blog_posts").insert(payload);

    if (error) {
      alert("Save failed: " + error.message);
      return;
    }
    setForm(emptyBlogForm);
    loadPosts();
  }

  function editPost(p: BlogPost) {
    setForm({
      id: p.id,
      slug: p.slug || "",
      title: p.title || "",
      excerpt: p.excerpt || "",
      content: p.content || "",
      tag: p.tag || "",
      cover_image_url: p.cover_image_url || "",
      attachments: p.attachments || [],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deletePost(p: BlogPost) {
    if (!confirm("Delete this post?")) return;

    if (p.cover_image_url) {
      const oldPath = extractStoragePath(p.cover_image_url, IMAGE_BUCKET);
      if (oldPath) {
        const { error: removeError } = await supabase.storage
          .from(IMAGE_BUCKET)
          .remove([oldPath]);
        if (removeError)
          console.error("Failed to remove post cover image:", removeError.message);
      }
    }

    const attachmentPaths = (p.attachments || []).map((a) => a.path).filter(Boolean);
    if (attachmentPaths.length) {
      const { error: removeErr } = await supabase.storage
        .from(IMAGE_BUCKET)
        .remove(attachmentPaths);
      if (removeErr)
        console.error("Failed to remove post attachments:", removeErr.message);
    }

    const { error } = await supabase.from("blog_posts").delete().eq("id", p.id);
    if (error) {
      alert("Delete failed: " + error.message);
      return;
    }
    loadPosts();
  }

  function insertAttachmentMarkdown(att: Attachment) {
    const snippet = `![${att.name}](${att.url})`;
    const textarea = contentTextareaRef.current;

    if (!textarea) {
      setForm((prev) => ({ ...prev, content: prev.content + "\n" + snippet }));
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const next = form.content.slice(0, start) + snippet + form.content.slice(end);
    setForm((prev) => ({ ...prev, content: next }));

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + snippet.length;
    });
  }

  return (
    <section className="admin-tab-panel">
      <h2 className="admin-section-title">Add / Edit Blog Post</h2>
      <form className="admin-form" onSubmit={submitBlog}>
        <BlogForm
          form={form}
          onChange={setForm}
          contentTextareaRef={contentTextareaRef}
        />

        <AttachmentManager
          attachments={form.attachments}
          onChange={(attachments) => setForm((prev) => ({ ...prev, attachments }))}
          onInsert={insertAttachmentMarkdown}
        />

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn">
            {form.id ? "Save Changes" : "Add Post"}
          </button>
          {form.id && (
            <button
              type="button"
              className="admin-btn admin-btn-ghost"
              onClick={() => setForm(emptyBlogForm)}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <BlogPostList posts={posts} onEdit={editPost} onDelete={deletePost} />
    </section>
  );
}

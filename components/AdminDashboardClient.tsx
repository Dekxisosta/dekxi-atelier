"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ImageUploader from "@/components/ImageUploader";
import FriendPreview from "@/components/FriendPreview";
import { extractStoragePath } from "@/lib/supabase/storage-utils";

const IMAGE_BUCKET = "site-images";
const FRAME_BUCKET = "profile-frames";

type FriendLink = { name: string; url: string };

type Friend = {
  id: string;
  friend_name: string;
  friend_description: string | null;
  friend_profile_picture_link: string;
  friend_cover_link: string | null;
  friend_frame_link: string | null;
  friend_tags: string[] | null;
  friend_links: FriendLink[] | null;
};

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string | null;
  tag: string;
  cover_image_url: string | null;
};

const emptyFriendForm = {
  id: "",
  friend_name: "",
  friend_description: "",
  friend_profile_picture_link: "",
  friend_cover_link: "",
  friend_frame_link: "",
  friend_tags: "",
  friend_links: ""
};

const emptyBlogForm = {
  id: "",
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  tag: "",
  cover_image_url: ""
};

function parseLinks(text: string): FriendLink[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, url] = line.split("|").map((s) => s.trim());
      return { name, url };
    })
    .filter((l) => l.name && l.url);
}

function linksToText(links: FriendLink[] | null | undefined) {
  if (!links || !links.length) return "";
  return links.map((l) => `${l.name} | ${l.url}`).join("\n");
}

export default function AdminDashboardClient() {
  const router = useRouter();
  const supabase = createClient();

  const [tab, setTab] = useState<"friends" | "blog">("friends");

  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendForm, setFriendForm] = useState(emptyFriendForm);

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [blogForm, setBlogForm] = useState(emptyBlogForm);

  const friendPreviewTags = useMemo(
    () =>
      friendForm.friend_tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    [friendForm.friend_tags]
  );

  const friendPreviewLinks = useMemo(
    () => parseLinks(friendForm.friend_links),
    [friendForm.friend_links]
  );

  async function loadFriends() {
    const { data, error } = await supabase
      .from("friends")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setFriends(data || []);
  }

  async function loadPosts() {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("published_at", { ascending: false });
    if (!error) setPosts(data || []);
  }

  useEffect(() => {
    loadFriends();
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  // ── Friends CRUD ──
  async function submitFriend(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      friend_name: friendForm.friend_name.trim(),
      friend_description: friendForm.friend_description.trim(),
      friend_profile_picture_link: friendForm.friend_profile_picture_link.trim(),
      friend_cover_link: friendForm.friend_cover_link.trim(),
      friend_frame_link: friendForm.friend_frame_link.trim(),
      friend_tags: friendForm.friend_tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      friend_links: parseLinks(friendForm.friend_links)
    };

    const { error } = friendForm.id
      ? await supabase.from("friends").update(payload).eq("id", friendForm.id)
      : await supabase.from("friends").insert(payload);

    if (error) {
      alert("Save failed: " + error.message);
      return;
    }
    setFriendForm(emptyFriendForm);
    loadFriends();
  }

  function editFriend(f: Friend) {
    setFriendForm({
      id: f.id,
      friend_name: f.friend_name || "",
      friend_description: f.friend_description || "",
      friend_profile_picture_link: f.friend_profile_picture_link || "",
      friend_cover_link: f.friend_cover_link || "",
      friend_frame_link: f.friend_frame_link || "",
      friend_tags: (f.friend_tags || []).join(", "),
      friend_links: linksToText(f.friend_links)
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteFriend(f: Friend) {
    if (!confirm("Delete this friend?")) return;

    const imagePathsToRemove = [f.friend_profile_picture_link, f.friend_cover_link]
      .filter((url): url is string => !!url)
      .map((url) => extractStoragePath(url, IMAGE_BUCKET))
      .filter((path): path is string => !!path);

    if (imagePathsToRemove.length) {
      const { error: removeError } = await supabase.storage
        .from(IMAGE_BUCKET)
        .remove(imagePathsToRemove);
      if (removeError) {
        console.error("Failed to remove friend images:", removeError.message);
        // non-fatal — still proceed with deleting the row
      }
    }

    if (f.friend_frame_link) {
      const framePath = extractStoragePath(f.friend_frame_link, FRAME_BUCKET);
      if (framePath) {
        const { error: frameRemoveError } = await supabase.storage
          .from(FRAME_BUCKET)
          .remove([framePath]);
        if (frameRemoveError) {
          console.error("Failed to remove friend frame:", frameRemoveError.message);
          // non-fatal — still proceed with deleting the row
        }
      }
    }

    const { error } = await supabase.from("friends").delete().eq("id", f.id);
    if (error) {
      alert("Delete failed: " + error.message);
      return;
    }
    loadFriends();
  }

  // ── Blog CRUD ──
  async function submitBlog(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      slug: blogForm.slug.trim(),
      title: blogForm.title.trim(),
      excerpt: blogForm.excerpt.trim(),
      content: blogForm.content.trim(),
      tag: blogForm.tag.trim(),
      cover_image_url: blogForm.cover_image_url.trim()
    };

    const { error } = blogForm.id
      ? await supabase.from("blog_posts").update(payload).eq("id", blogForm.id)
      : await supabase.from("blog_posts").insert(payload);

    if (error) {
      alert("Save failed: " + error.message);
      return;
    }
    setBlogForm(emptyBlogForm);
    loadPosts();
  }

  function editPost(p: BlogPost) {
    setBlogForm({
      id: p.id,
      slug: p.slug || "",
      title: p.title || "",
      excerpt: p.excerpt || "",
      content: p.content || "",
      tag: p.tag || "",
      cover_image_url: p.cover_image_url || ""
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
        if (removeError) {
          console.error("Failed to remove post cover image:", removeError.message);
          // non-fatal — still proceed with deleting the row
        }
      }
    }

    const { error } = await supabase.from("blog_posts").delete().eq("id", p.id);
    if (error) {
      alert("Delete failed: " + error.message);
      return;
    }
    loadPosts();
  }

  return (
    <div className="admin-wrap">
      <div className="admin-topbar">
        <span className="admin-topbar-title">L-CORP // ADMIN DASHBOARD</span>
        <button className="admin-btn admin-btn-small" onClick={handleLogout}>
          Log Out
        </button>
      </div>

      <div className="admin-tabs">
        <button
          className={"admin-tab" + (tab === "friends" ? " admin-tab-active" : "")}
          onClick={() => setTab("friends")}
        >
          Friends
        </button>
        <button
          className={"admin-tab" + (tab === "blog" ? " admin-tab-active" : "")}
          onClick={() => setTab("blog")}
        >
          Blog Posts
        </button>
      </div>

      {tab === "friends" && (
        <section className="admin-tab-panel">
          <div className="admin-columns">
            <div className="admin-column">
              <h2 className="admin-section-title">Add / Edit Friend</h2>
              <form className="admin-form" onSubmit={submitFriend}>
                <label className="admin-label">Name</label>
                <input
                  className="admin-input"
                  required
                  value={friendForm.friend_name}
                  onChange={(e) =>
                    setFriendForm({ ...friendForm, friend_name: e.target.value })
                  }
                />

                <label className="admin-label">Description</label>
                <textarea
                  className="admin-input"
                  rows={2}
                  value={friendForm.friend_description}
                  onChange={(e) =>
                    setFriendForm({ ...friendForm, friend_description: e.target.value })
                  }
                />

                <ImageUploader
                  bucket={IMAGE_BUCKET}
                  folder="friend-avatars"
                  label="Profile Picture"
                  required
                  previewShape="round"
                  value={friendForm.friend_profile_picture_link}
                  onChange={(url) =>
                    setFriendForm({ ...friendForm, friend_profile_picture_link: url })
                  }
                />

                <ImageUploader
                  bucket={IMAGE_BUCKET}
                  folder="friend-covers"
                  label="Cover Image"
                  value={friendForm.friend_cover_link}
                  onChange={(url) =>
                    setFriendForm({ ...friendForm, friend_cover_link: url })
                  }
                />

                <ImageUploader
                  bucket={FRAME_BUCKET}
                  label="Profile Frame (overlay, optional)"
                  previewShape="round"
                  value={friendForm.friend_frame_link}
                  onChange={(url) =>
                    setFriendForm({ ...friendForm, friend_frame_link: url })
                  }
                />

                <label className="admin-label">Tags (comma separated)</label>
                <input
                  className="admin-input"
                  placeholder="Artist, Arch Linux, ML/AI"
                  value={friendForm.friend_tags}
                  onChange={(e) =>
                    setFriendForm({ ...friendForm, friend_tags: e.target.value })
                  }
                />

                <label className="admin-label">Links (one per line: Name | URL)</label>
                <textarea
                  className="admin-input"
                  rows={3}
                  placeholder={"GitHub | https://github.com/example\nTwitter | https://x.com/example"}
                  value={friendForm.friend_links}
                  onChange={(e) =>
                    setFriendForm({ ...friendForm, friend_links: e.target.value })
                  }
                />

                <div className="admin-form-actions">
                  <button type="submit" className="admin-btn">
                    {friendForm.id ? "Save Changes" : "Add Friend"}
                  </button>
                  {friendForm.id && (
                    <button
                      type="button"
                      className="admin-btn admin-btn-ghost"
                      onClick={() => setFriendForm(emptyFriendForm)}
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="admin-column">
              <FriendPreview
                name={friendForm.friend_name}
                description={friendForm.friend_description}
                profilePicture={friendForm.friend_profile_picture_link}
                coverLink={friendForm.friend_cover_link}
                frameLink={friendForm.friend_frame_link}
                tags={friendPreviewTags}
                links={friendPreviewLinks}
              />

              <h2 className="admin-section-title">Existing Friends</h2>
              <div className="admin-list">
                {friends.length === 0 && <p>No friends yet.</p>}
                {friends.map((f) => (
                  <div className="admin-row" key={f.id}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="admin-row-avatar"
                      src={f.friend_profile_picture_link}
                      alt=""
                    />
                    <div className="admin-row-info">
                      <strong>{f.friend_name}</strong>
                      <span>{f.friend_description || ""}</span>
                    </div>
                    <div className="admin-row-actions">
                      <button className="admin-btn admin-btn-small" onClick={() => editFriend(f)}>
                        Edit
                      </button>
                      <button
                        className="admin-btn admin-btn-small admin-btn-danger"
                        onClick={() => deleteFriend(f)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {tab === "blog" && (
        <section className="admin-tab-panel">
          <div className="admin-columns">
            <div className="admin-column">
              <h2 className="admin-section-title">Add / Edit Blog Post</h2>
              <form className="admin-form" onSubmit={submitBlog}>
                <label className="admin-label">Slug (unique, e.g. my-post-title)</label>
                <input
                  className="admin-input"
                  required
                  value={blogForm.slug}
                  onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                />

                <label className="admin-label">Title</label>
                <input
                  className="admin-input"
                  required
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                />

                <label className="admin-label">Excerpt</label>
                <textarea
                  className="admin-input"
                  rows={2}
                  required
                  value={blogForm.excerpt}
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                />

                <ImageUploader
                  bucket={IMAGE_BUCKET}
                  folder="blog-covers"
                  label="Cover Image"
                  value={blogForm.cover_image_url}
                  onChange={(url) => setBlogForm({ ...blogForm, cover_image_url: url })}
                />

                <label className="admin-label">Content (full post body)</label>
                <textarea
                  className="admin-input"
                  rows={6}
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                />

                <label className="admin-label">Tag</label>
                <input
                  className="admin-input"
                  placeholder="devlog"
                  value={blogForm.tag}
                  onChange={(e) => setBlogForm({ ...blogForm, tag: e.target.value })}
                />

                <div className="admin-form-actions">
                  <button type="submit" className="admin-btn">
                    {blogForm.id ? "Save Changes" : "Add Post"}
                  </button>
                  {blogForm.id && (
                    <button
                      type="button"
                      className="admin-btn admin-btn-ghost"
                      onClick={() => setBlogForm(emptyBlogForm)}
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="admin-column">
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
                      <button className="admin-btn admin-btn-small" onClick={() => editPost(p)}>
                        Edit
                      </button>
                      <button
                        className="admin-btn admin-btn-small admin-btn-danger"
                        onClick={() => deletePost(p)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
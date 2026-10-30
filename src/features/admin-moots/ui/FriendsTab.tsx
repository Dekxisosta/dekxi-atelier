"use client";

import { useEffect, useState } from "react";
import { createClient } from "@shared/supabase/client";
import { extractStoragePath } from "@shared/supabase/storage-utils";
import {
  type Friend,
  emptyFriendForm,
  parseLinks,
} from "@entities/friend";
import FriendForm from "./FriendForm";
import FriendList from "./FriendList";

const IMAGE_BUCKET = "site-images";
const FRAME_BUCKET = "profile-frames";

export default function FriendsTab() {
  const supabase = createClient();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [form, setForm] = useState(emptyFriendForm);

  async function loadFriends() {
    const { data, error } = await supabase
      .from("friends")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setFriends(data || []);
  }

  useEffect(() => {
    loadFriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submitFriend(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      friend_name: form.friend_name.trim(),
      friend_description: form.friend_description.trim(),
      friend_profile_picture_link: form.friend_profile_picture_link.trim(),
      friend_cover_link: form.friend_cover_link.trim(),
      friend_frame_link: form.friend_frame_link.trim(),
      friend_tags: form.friend_tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      friend_links: parseLinks(form.friend_links),
    };

    const { error } = form.id
      ? await supabase.from("friends").update(payload).eq("id", form.id)
      : await supabase.from("friends").insert(payload);

    if (error) {
      alert("Save failed: " + error.message);
      return;
    }
    setForm(emptyFriendForm);
    loadFriends();
  }

  function editFriend(f: Friend) {
    setForm({
      id: f.id,
      friend_name: f.friend_name || "",
      friend_description: f.friend_description || "",
      friend_profile_picture_link: f.friend_profile_picture_link || "",
      friend_cover_link: f.friend_cover_link || "",
      friend_frame_link: f.friend_frame_link || "",
      friend_tags: (f.friend_tags || []).join(", "),
      friend_links: (f.friend_links || [])
        .map((l) => `${l.name} | ${l.url}`)
        .join("\n"),
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
      if (removeError)
        console.error("Failed to remove friend images:", removeError.message);
    }

    if (f.friend_frame_link) {
      const framePath = extractStoragePath(f.friend_frame_link, FRAME_BUCKET);
      if (framePath) {
        const { error: frameErr } = await supabase.storage
          .from(FRAME_BUCKET)
          .remove([framePath]);
        if (frameErr)
          console.error("Failed to remove friend frame:", frameErr.message);
      }
    }

    const { error } = await supabase.from("friends").delete().eq("id", f.id);
    if (error) {
      alert("Delete failed: " + error.message);
      return;
    }
    loadFriends();
  }

  return (
    <section className="admin-tab-panel">
      <div className="admin-columns">
        <div className="admin-column">
          <h2 className="admin-section-title">Add / Edit Friend</h2>
          <FriendForm
            form={form}
            onChange={setForm}
            onSubmit={submitFriend}
            onCancel={() => setForm(emptyFriendForm)}
          />
        </div>

        <div className="admin-column">
          <h2 className="admin-section-title">Existing Friends</h2>
          <FriendList
            friends={friends}
            onEdit={editFriend}
            onDelete={deleteFriend}
          />
        </div>
      </div>
    </section>
  );
}

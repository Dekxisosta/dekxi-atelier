export type FriendLink = { name: string; url: string };

export type Friend = {
  id: string;
  friend_name: string;
  friend_description: string | null;
  friend_profile_picture_link: string;
  friend_cover_link: string | null;
  friend_frame_link: string | null;
  friend_tags: string[] | null;
  friend_links: FriendLink[] | null;
};

// ── Admin form helpers ─────────────────────────────────────────────────────
export const emptyFriendForm = {
  id: "",
  friend_name: "",
  friend_description: "",
  friend_profile_picture_link: "",
  friend_cover_link: "",
  friend_frame_link: "",
  friend_tags: "",
  friend_links: "",
};

export type FriendFormState = typeof emptyFriendForm;

export function parseLinks(text: string): FriendLink[] {
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

export function linksToText(links: FriendLink[] | null | undefined): string {
  if (!links || !links.length) return "";
  return links.map((l) => `${l.name} | ${l.url}`).join("\n");
}

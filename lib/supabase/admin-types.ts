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

export type Attachment = { name: string; url: string; path: string };

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string | null;
  tag: string;
  cover_image_url: string | null;
  attachments: Attachment[] | null;
};

export type GalleryImage = {
  id: string;
  image_url: string;
  storage_path: string;
  caption: string | null;
  description: string | null;
  location: string | null;
  tags: string[];
  created_at: string;
};

export const emptyFriendForm = {
  id: "",
  friend_name: "",
  friend_description: "",
  friend_profile_picture_link: "",
  friend_cover_link: "",
  friend_frame_link: "",
  friend_tags: "",
  friend_links: ""
};

export type FriendFormState = typeof emptyFriendForm;

export const emptyBlogForm = {
  id: "",
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  tag: "",
  cover_image_url: "",
  attachments: [] as Attachment[]
};

export type BlogFormState = typeof emptyBlogForm;

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

export function linksToText(links: FriendLink[] | null | undefined) {
  if (!links || !links.length) return "";
  return links.map((l) => `${l.name} | ${l.url}`).join("\n");
}
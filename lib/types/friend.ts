export type Friend = {
  id: string;
  friend_name: string;
  friend_profile_picture_link: string;
  friend_cover_link: string | null;
  friend_frame_link: string | null;
  friend_description: string | null;
  friend_tags: string[] | null;
  friend_links: { name: string; url: string }[] | null;
};
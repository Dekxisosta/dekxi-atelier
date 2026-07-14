import { notFound } from "next/navigation";
import Link from "next/link";
import IdeHeader from "@/components/IdeHeader";
import { createClient } from "@/lib/supabase/server";
import { FRIEND_LINK_ICON_MAP } from "@/lib/friend-icon-map";
import { DEFAULT_FRAME_URL } from "@/lib/constants";
import "./friend-detail.css";

export const dynamic = "force-dynamic";

type Friend = {
  id: string;
  friend_name: string;
  friend_profile_picture_link: string;
  friend_cover_link: string | null;
  friend_frame_link: string | null;
  friend_description: string | null;
  friend_tags: string[] | null;
  friend_links: { name: string; url: string }[] | null;
};

async function getFriend(id: string): Promise<Friend | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from("friends").select("*").eq("id", id).single();
  if (error || !data) return null;
  return data;
}

export default async function FriendDetailPage({ params }: { params: { id: string } }) {
  const friend = await getFriend(params.id);
  if (!friend) notFound();

  return (
    <div className="container-page">
      <div className="bg-decor"></div>
      <div className="container-main-decor-fur">
        <div className="container-main-decor">
          <IdeHeader />

          <div className="profile-header-container">
            <div
              className="header-banner"
              style={{
                backgroundImage: friend.friend_cover_link
                  ? `url('${friend.friend_cover_link}')`
                  : undefined
              }}
            ></div>

            <div className="profile-meta-row">
              <div className="avatar-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="avatar"
                  src={friend.friend_profile_picture_link}
                  alt={friend.friend_name}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="avatar-gif" src={friend.friend_frame_link || DEFAULT_FRAME_URL} alt="" />
              </div>
            </div>

            <div className="profile-text-identity">
              <div className="profile-name-row">
                <h1 className="hero-name">{friend.friend_name}</h1>
              </div>
              {friend.friend_description && (
                <p className="hero-bio">{friend.friend_description}</p>
              )}
            </div>
          </div>

          <div className="friend-detail-body">
            {friend.friend_tags && friend.friend_tags.length > 0 && (
              <div className="friend-tags friend-detail-tags">
                {friend.friend_tags.map((tag) => (
                  <span className="friend-tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {friend.friend_links && friend.friend_links.length > 0 && (
              <div className="friend-links friend-detail-links">
                {friend.friend_links.map((link) => (
                  <a
                    key={link.name}
                    className="friend-link-badge"
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={link.name}
                  >
                    <ion-icon
                      name={FRIEND_LINK_ICON_MAP[link.name] || "link-outline"}
                    ></ion-icon>
                  </a>
                ))}
              </div>
            )}

            <Link href="/moots" className="friend-detail-back">
              ← back to moots
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
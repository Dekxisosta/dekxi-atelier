import { notFound } from "next/navigation";
import Link from "next/link";
import IdeHeader from "@/components/IdeHeader";
import { createClient } from "@/lib/supabase/server";
import { FRIEND_LINK_ICON_MAP } from "@/lib/friend-icon-map";
import { DEFAULT_FRAME_URL } from "@/lib/constants";
import type { Friend } from "@/lib/types/friend";

export const dynamic = "force-dynamic";

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

          <Link href="/?tab=moots" className="friend-detail-back">
            <ion-icon name="arrow-back-outline"></ion-icon>
            <span>back to moots</span>
          </Link>

          <div className="friend-detail-layout">
            {/* ── LEFT: PROFILE CARD ── */}
            <div className="friend-detail-panel">
              <div className="friend-detail-hero">
                <div
                  className={
                    "friend-detail-cover" +
                    (!friend.friend_cover_link ? " friend-detail-cover-empty" : "")
                  }
                  style={
                    friend.friend_cover_link
                      ? { backgroundImage: `url('${friend.friend_cover_link}')` }
                      : undefined
                  }
                >
                  <div className="friend-detail-cover-fade"></div>
                </div>

                <div className="friend-detail-avatar-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="friend-detail-avatar"
                    src={friend.friend_profile_picture_link}
                    alt={friend.friend_name}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="friend-detail-avatar-frame"
                    src={friend.friend_frame_link || DEFAULT_FRAME_URL}
                    alt=""
                  />
                </div>

                <h1 className="friend-detail-name">{friend.friend_name}</h1>
                {friend.friend_description && (
                  <p className="friend-detail-bio">{friend.friend_description}</p>
                )}
              </div>

              <div className="friend-detail-body">
                {friend.friend_tags && friend.friend_tags.length > 0 && (
                  <div className="friend-detail-section">
                    <span className="friend-detail-section-label">tags</span>
                    <div className="friend-tags friend-detail-tags">
                      {friend.friend_tags.map((tag) => (
                        <span className="friend-tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {friend.friend_links && friend.friend_links.length > 0 && (
                  <div className="friend-detail-section">
                    <span className="friend-detail-section-label">links</span>
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
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT: ALBUM ── */}
            <div className="friend-detail-album">
              <div className="friend-detail-album-header">
                <span className="friend-detail-album-title">album</span>
                <span className="friend-detail-album-count">0 photos</span>
              </div>

              <div className="friend-detail-album-empty">
                <div className="friend-detail-album-grid">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div className="friend-detail-album-slot" key={i}>
                      <ion-icon name="image-outline"></ion-icon>
                    </div>
                  ))}
                </div>
                <p className="friend-detail-album-empty-text">no memories saved yet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
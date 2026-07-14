import IdeHeader from "@/components/IdeHeader";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { FRIEND_LINK_ICON_MAP } from "@/lib/friend-icon-map";
import { DEFAULT_FRAME_URL } from "@/lib/constants";

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

// Fisher-Yates, run server-side per request so the shuffle can't be seen
// or replayed by inspecting client JS.
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function getFriends(): Promise<Friend[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("friends").select("*");
  if (error) {
    console.error("Failed to load friends from Supabase:", error.message);
    return [];
  }
  return shuffle(data || []);
}

export default async function MootsPage() {
  const friends = await getFriends();

  return (
    <div className="container-page">
      <div className="bg-decor"></div>
      <div className="container-main-decor-fur">
        <div className="container-main-decor">
          <IdeHeader />
        </div>
      </div>
      <div className="friends-main">
        <div className="friends-content">
          <div className="mutuals-header">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="mutuals-header-icon"
              src="https://img1.picmix.com/output/stamp/normal/1/6/4/3/2763461_c4a5d.png"
              alt=""
            />
            <span className="mutuals-header-label">moots!!</span>
            <div className="mutuals-header-line"></div>
          </div>

          <div className="friends-list" id="friendsList">
            {friends.length === 0 && <p>No moots yet.</p>}
            {friends.map((f, i) => (
              <div
                key={f.id}
                className="friend-row"
                style={{ animationDelay: `${0.1 + i * 0.05}s` }}
              >
                <div
                  className="friend-cover"
                  style={{
                    backgroundImage: `url('${f.friend_cover_link || ""}')`
                  }}
                ></div>
                <Link href={`/moots/${f.id}`} className="friend-header-link">
                  <div className="friend-header">
                    <div className="friend-avatar-wrap">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="friend-avatar"
                        src={f.friend_profile_picture_link}
                        alt={f.friend_name}
                      />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="friend-avatar-gif"
                        src={f.friend_frame_link || DEFAULT_FRAME_URL}
                        alt=""
                      />
                    </div>
                  </div>
                </Link>
                <div className="friend-text">
                  <Link href={`/moots/${f.id}`} className="friend-name-link">
                    <span className="friend-name">{f.friend_name}</span>
                  </Link>
                  {f.friend_description && (
                    <span className="friend-desc">{f.friend_description}</span>
                  )}
                  {f.friend_tags && f.friend_tags.length > 0 && (
                    <div className="friend-tags">
                      {f.friend_tags.map((tag) => (
                        <span className="friend-tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {f.friend_links && f.friend_links.length > 0 && (
                    <div className="friend-links">
                      {f.friend_links.map((link) => (
                        <a
                          key={link.name}
                          className="friend-link-badge"
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={link.name}
                        >
                          <ion-icon name={FRIEND_LINK_ICON_MAP[link.name] || "link-outline"}></ion-icon>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
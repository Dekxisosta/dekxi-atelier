import Link from "next/link";
import { FRIEND_LINK_ICON_MAP } from "@/lib/friend-icon-map";
import { DEFAULT_FRAME_URL } from "@/lib/constants";
import type { Friend } from "../page";

export default function Moots({ friends }: { friends: Friend[] }) {
  return (
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
                style={{ backgroundImage: `url('${f.friend_cover_link || ""}')` }}
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
  );
}
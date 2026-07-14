"use client";

import { FRIEND_LINK_ICON_MAP } from "@/lib/friend-icon-map";
import { DEFAULT_FRAME_URL } from "@/lib/constants";

type PreviewLink = { name: string; url: string };

type FriendPreviewProps = {
  name: string;
  description: string;
  profilePicture: string;
  coverLink: string;
  frameLink: string;
  tags: string[];
  links: PreviewLink[];
};

export default function FriendPreview({
  name,
  description,
  profilePicture,
  coverLink,
  frameLink,
  tags,
  links
}: FriendPreviewProps) {
  const hasContent = name || profilePicture;

  return (
    <div className="admin-preview-frame">
      <span className="admin-preview-label">live preview — renders exactly like /moots</span>

      {!hasContent ? (
        <p className="admin-preview-empty">Fill in a name and profile picture to see it here.</p>
      ) : (
        <div className="friends-list admin-preview-list">
          <div className="friend-row">
            <div
              className="friend-cover"
              style={{ backgroundImage: `url('${coverLink || ""}')` }}
            ></div>
            <div className="friend-header">
              <div className="friend-avatar-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="friend-avatar" src={profilePicture} alt={name} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="friend-avatar-gif" src={frameLink || DEFAULT_FRAME_URL} alt="" />
              </div>
            </div>
            <div className="friend-text">
              <span className="friend-name">{name || "friend name"}</span>
              {description && <span className="friend-desc">{description}</span>}
              {tags.length > 0 && (
                <div className="friend-tags">
                  {tags.map((tag) => (
                    <span className="friend-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {links.length > 0 && (
                <div className="friend-links">
                  {links.map((link) => (
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
        </div>
      )}
    </div>
  );
}
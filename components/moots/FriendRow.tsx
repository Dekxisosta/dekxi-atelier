import Link from "next/link";
import FriendAvatar from "@/components/moots/FriendAvatar";
import FriendLinks from "@/components/moots/FriendLinks";
import type { Friend } from "@/lib/types/friend";

export default function FriendRow({ friend, delay }: { friend: Friend; delay: number }) {
  const hasLinks = !!friend.friend_links && friend.friend_links.length > 0;

  return (
    <div className="friend-row" style={{ animationDelay: `${delay}s` }}>
      <div
        className="friend-cover"
        style={{ backgroundImage: `url('${friend.friend_cover_link || ""}')` }}
      ></div>

      <div className="friend-header">
        <FriendAvatar friend={friend} />
      </div>

      <div className="friend-text">
        <span className="friend-name">{friend.friend_name}</span>

        {friend.friend_description && (
          <span className="friend-desc">{friend.friend_description}</span>
        )}

        {friend.friend_tags && friend.friend_tags.length > 0 && (
          <div className="friend-tags">
            {friend.friend_tags.map((tag) => (
              <span className="friend-tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="friend-link-container">
            {hasLinks && <FriendLinks links={friend.friend_links!} />}

            <Link
            href={`/moots/${friend.id}`}
            style={{ marginTop: hasLinks ? "auto" : undefined }}
            className="friend-view-link"
            >
            <span>view profile</span>
            <ion-icon name="arrow-forward-outline"></ion-icon>
            </Link>
        </div>
      </div>
    </div>
  );
}
import { FriendAvatar, FriendLinks } from "@entities/friend";
import type { Friend } from "@entities/friend";

export default function FriendRow({ friend, delay }: { friend: Friend; delay: number }) {
  const hasLinks = !!friend.friend_links && friend.friend_links.length > 0;

  return (
    <div className="friend-row" style={{ animationDelay: `${delay}s` }}>
      <div
        className="friend-cover"
        style={{ backgroundImage: `url('${friend.friend_cover_link || ""}')` }}
      />
      <div className="friend-header">
        <FriendAvatar friend={friend} />
      </div>
      <div className="friend-text">
        <span className="friend-name">{friend.friend_name}</span>
        <div className="friend-link-container">
          {hasLinks && <FriendLinks links={friend.friend_links!} />}
        </div>
      </div>
    </div>
  );
}

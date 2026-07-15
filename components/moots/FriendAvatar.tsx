import { DEFAULT_FRAME_URL } from "@/lib/constants";
import type { Friend } from "@/lib/types/friend"; // adjust to wherever Friend now lives

export default function FriendAvatar({ friend }: { friend: Friend }) {
  return (
    <div className="friend-avatar-wrap">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="friend-avatar"
        src={friend.friend_profile_picture_link}
        alt={friend.friend_name}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="friend-avatar-gif"
        src={friend.friend_frame_link || DEFAULT_FRAME_URL}
        alt=""
      />
    </div>
  );
}
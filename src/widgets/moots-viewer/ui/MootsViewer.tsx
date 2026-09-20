import type { Friend } from "@entities/friend";
import MootsHeader from "./MootsHeader";
import FriendRow from "./FriendRow";

export default function MootsViewer({ friends }: { friends: Friend[] }) {
  return (
    <div className="friends-main">
      <div className="friends-content">
        <MootsHeader />
        <div className="friends-list" id="friendsList">
          {friends.length === 0 && <p>No moots yet.</p>}
          {friends.map((f, i) => (
            <FriendRow key={f.id} friend={f} delay={0.1 + i * 0.05} />
          ))}
        </div>
      </div>
    </div>
  );
}

import MootsHeader from "@/components/moots/MootsHeader";
import FriendRow from "@/components/moots/FriendRow";
import type { Friend } from "@/lib/types/friend";

export default function Moots({ friends }: { friends: Friend[] }) {
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
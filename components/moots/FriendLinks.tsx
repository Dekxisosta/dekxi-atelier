import { FRIEND_LINK_ICON_MAP } from "@/lib/friend-icon-map";
import type { Friend } from "@/lib/types/friend";

export default function FriendLinks({ links }: { links: NonNullable<Friend["friend_links"]> }) {
  if (links.length === 0) return null;

  return (
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
  );
}
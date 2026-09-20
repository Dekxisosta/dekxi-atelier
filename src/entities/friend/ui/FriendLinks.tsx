import type { Friend } from "../model/types";

// Platform name → Ionicon name map
const FRIEND_LINK_ICON_MAP: Record<string, string> = {
  GitHub: "logo-github",
  Twitter: "logo-twitter",
  Carrd: "link-outline",
  Bluesky: "cloud-outline",
  Instagram: "logo-instagram",
  TikTok: "logo-tiktok",
  YouTube: "logo-youtube",
  "Ko-fi": "cafe-outline",
  Email: "mail-outline",
  Discord: "logo-discord",
  "Personal Page": "person-circle-outline",
  Facebook: "logo-facebook",
  Roblox: "game-controller",
  Pornhub: "git-network",
};

export { FRIEND_LINK_ICON_MAP };

export default function FriendLinks({
  links,
}: {
  links: NonNullable<Friend["friend_links"]>;
}) {
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
          <ion-icon
            name={FRIEND_LINK_ICON_MAP[link.name] || "link-outline"}
          ></ion-icon>
        </a>
      ))}
    </div>
  );
}

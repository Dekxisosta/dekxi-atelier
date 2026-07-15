import { CONTENT_LINKS } from "@/lib/data/profile-links";

export default function ContentGrid() {
  return (
    <div className="content content-grid">
      {CONTENT_LINKS.map((link) => (
        <a
          key={link.alt}
          className="link-card visible"
          href={link.href}
          target={link.href.startsWith("http") ? "_blank" : undefined}
          rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          <div className="link-icon-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="link-icon"
              src={link.icon}
              alt={link.alt}
              style={link.invert ? { filter: "invert(1) opacity(0.85)" } : undefined}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="link-frame" src={link.frame} alt="" />
          </div>
        </a>
      ))}
    </div>
  );
}
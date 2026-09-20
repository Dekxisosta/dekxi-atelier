import { PROFILE_LINKS } from "@entities/profile";

export default function LinksSection() {
  return (
    <div className="commission-panel">
      <h3 className="commission-block-title">Find Me</h3>
      <div className="commission-links">
        {PROFILE_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="commission-link-chip"
          >
            <span className="commission-link-icon-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={link.icon}
                alt=""
                className="commission-link-icon"
                style={link.invert ? { filter: "invert(1) opacity(0.85)" } : undefined}
              />
            </span>
            <span className="commission-link-label">{link.label}</span>
            <span className="commission-link-arrow">
              <ion-icon name="arrow-forward-outline" />
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

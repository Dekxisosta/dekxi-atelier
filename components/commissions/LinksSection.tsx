import type { CommissionLink } from "@/lib/types/commission";

export default function LinksSection({ links }: { links: CommissionLink[] }) {
  return (
    <div className="commission-block">
      <h3 className="commission-block-title">Find Me</h3>
      <div className="commission-links">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="commission-link-chip"
          >
            {link.iconUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={link.iconUrl} alt="" className="commission-link-icon" />
            ) : (
              <span className="commission-link-badge">{link.badgeText}</span>
            )}
            <span>{link.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
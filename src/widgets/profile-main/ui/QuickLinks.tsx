import { CONTENT_LINKS } from "@entities/profile";

const CATEGORY_ORDER = ["Games", "Anime", "Dev tools", "Coding"];

/** Quick links, grouped by category. */
export default function QuickLinks() {
  return (
    <div className="quick-links">
      {CATEGORY_ORDER.map((category) => {
        const links = CONTENT_LINKS.filter((l) => l.category === category);
        if (links.length === 0) return null;
        return (
          <section key={category} className="quick-links-group">
            <h4 className="quick-links-heading">{category}</h4>
            <ul className="quick-links-list">
              {links.map((link) => (
                <li key={link.alt}>
                  <a
                    className="quick-link"
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={link.icon}
                      alt=""
                      style={link.invert ? { filter: "invert(1) opacity(0.85)" } : undefined}
                    />
                    <span>{link.alt}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

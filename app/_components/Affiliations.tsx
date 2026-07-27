"use client";

type Affiliation = {
  id: string;
  name: string;
  role?: string;
  logo_url?: string;
  link_url?: string;
};

// TODO: replace with real affiliation/organization data.
const PLACEHOLDER_AFFILIATIONS: Affiliation[] = [];

export default function Affiliations() {
  return (
    <section className="affiliations-section">
      <h2 className="section-title">Affiliations</h2>

      {PLACEHOLDER_AFFILIATIONS.length === 0 ? (
        <p className="section-empty-state">No affiliations listed yet.</p>
      ) : (
        <div className="affiliations-grid">
          {PLACEHOLDER_AFFILIATIONS.map((a) => (
            <article key={a.id} className="affiliation-card">
              {a.logo_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.logo_url} alt="" className="affiliation-logo" />
              )}
              <h3 className="affiliation-name">{a.name}</h3>
              {a.role && <p className="affiliation-role">{a.role}</p>}
              {a.link_url && (
                <a href={a.link_url} className="affiliation-link" target="_blank" rel="noopener noreferrer">
                  visit →
                </a>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
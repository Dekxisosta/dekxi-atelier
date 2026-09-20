"use client";

type Certificate = { id: string; title: string; issuer: string; date?: string; image_url?: string; credential_url?: string };
const PLACEHOLDER_CERTS: Certificate[] = [];

export default function Certificates() {
  return (
    <section className="certificates-section">
      <h2 className="section-title">Certificates &amp; Achievements</h2>
      {PLACEHOLDER_CERTS.length === 0 ? (
        <p className="section-empty-state">Nothing added yet.</p>
      ) : (
        <div className="certificates-grid">
          {PLACEHOLDER_CERTS.map((c) => (
            <article key={c.id} className="certificate-card">
              {c.image_url && <img src={c.image_url} alt="" className="certificate-image" />}
              <h3 className="certificate-title">{c.title}</h3>
              <p className="certificate-issuer">{c.issuer}</p>
              {c.date && <span className="certificate-date">{c.date}</span>}
              {c.credential_url && (
                <a href={c.credential_url} className="certificate-link" target="_blank" rel="noopener noreferrer">
                  view credential →
                </a>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

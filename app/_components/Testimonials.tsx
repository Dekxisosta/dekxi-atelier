"use client";

type Testimonial = {
  id: string;
  name: string;
  avatar_url?: string;
  message: string;
  date?: string;
};

// TODO: replace with real data fetched from Supabase, same pattern as
// `friends`/`posts` being passed down from the server component.
const PLACEHOLDER_TESTIMONIALS: Testimonial[] = [];

export default function Testimonials() {
  return (
    <section className="testimonials-section">
      <h2 className="section-title">Testimonials</h2>

      {PLACEHOLDER_TESTIMONIALS.length === 0 ? (
        <p className="section-empty-state">No testimonials yet — check back soon!</p>
      ) : (
        <div className="testimonials-grid">
          {PLACEHOLDER_TESTIMONIALS.map((t) => (
            <article key={t.id} className="testimonial-card">
              {t.avatar_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.avatar_url} alt="" className="testimonial-avatar" />
              )}
              <p className="testimonial-message">{t.message}</p>
              <span className="testimonial-name">{t.name}</span>
              {t.date && <span className="testimonial-date">{t.date}</span>}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
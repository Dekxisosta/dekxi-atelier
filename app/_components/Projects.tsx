"use client";

type Project = {
  id: string;
  title: string;
  description: string;
  cover_image_url?: string;
  link_url?: string;
  tags?: string[];
};

// TODO: replace with real project data.
const PLACEHOLDER_PROJECTS: Project[] = [];

export default function Projects() {
  return (
    <section className="projects-section">
      <h2 className="section-title">Projects</h2>

      {PLACEHOLDER_PROJECTS.length === 0 ? (
        <p className="section-empty-state">No projects listed yet.</p>
      ) : (
        <div className="projects-grid">
          {PLACEHOLDER_PROJECTS.map((p) => (
            <article key={p.id} className="project-card">
              {p.cover_image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.cover_image_url} alt="" className="project-cover" />
              )}
              <h3 className="project-title">{p.title}</h3>
              <p className="project-description">{p.description}</p>
              {p.tags && (
                <div className="project-tags">
                  {p.tags.map((tag) => (
                    <span key={tag} className="project-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {p.link_url && (
                <a href={p.link_url} className="project-link" target="_blank" rel="noopener noreferrer">
                  view project →
                </a>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
"use client";

type RoadmapItem = { id: string; label: string; status: "done" | "in-progress" | "planned" };
const STACK: string[] = [];
const ROADMAP: RoadmapItem[] = [];

export default function TechStack() {
  return (
    <section className="techstack-section">
      <h2 className="section-title">Tech Stack</h2>
      {STACK.length === 0 ? (
        <p className="section-empty-state">Stack list coming soon.</p>
      ) : (
        <div className="techstack-tags">
          {STACK.map((tech) => <span key={tech} className="tech-tag">{tech}</span>)}
        </div>
      )}
      <h2 className="section-title" style={{ marginTop: "2rem" }}>Roadmap</h2>
      {ROADMAP.length === 0 ? (
        <p className="section-empty-state">Roadmap coming soon.</p>
      ) : (
        <ul className="roadmap-list">
          {ROADMAP.map((item) => (
            <li key={item.id} className={`roadmap-item roadmap-${item.status}`}>
              <span className="roadmap-status-dot" />
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

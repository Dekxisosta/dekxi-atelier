"use client";

import { useEffect, useState } from "react";
import type { GithubRepo, GithubCollaborator } from "@shared/api/github";

const PROFILE_URL = "https://github.com/Dekxisosta";

function timeAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return "today";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function ProjectGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [broken, setBroken] = useState<Set<string>>(new Set());
  const visible = images.filter((src) => !broken.has(src));
  if (visible.length === 0) return null;
  const current = visible[Math.min(active, visible.length - 1)];

  return (
    <div className="project-gallery">
      <a href={current} target="_blank" rel="noopener noreferrer" className="project-cover-link">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="project-cover"
          src={current}
          alt={`${name} preview`}
          loading="lazy"
          onError={() => setBroken((prev) => new Set(prev).add(current))}
        />
      </a>
      {visible.length > 1 && (
        <div className="project-thumbs">
          {visible.map((src, i) => (
            <button
              key={src}
              type="button"
              className={`project-thumb${src === current ? " is-active" : ""}`}
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1} of ${visible.length}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                loading="lazy"
                onError={() => setBroken((prev) => new Set(prev).add(src))}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Collaborators({ people }: { people: GithubCollaborator[] }) {
  if (people.length === 0) return null;
  return (
    <div className="project-collabs" aria-label="Collaborators">
      <span className="project-collabs-label">with</span>
      <ul className="project-collab-list">
        {people.slice(0, 10).map((c) => (
          <li key={c.login}>
            <a href={c.url} target="_blank" rel="noopener noreferrer" title={c.login} className="project-collab">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${c.avatarUrl}${c.avatarUrl.includes("?") ? "&" : "?"}s=48`} alt={c.login} loading="lazy" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Projects() {
  const [repos, setRepos] = useState<GithubRepo[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/api/github/repos", { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: GithubRepo[]) => setRepos(data))
      .catch((e) => {
        if (e?.name !== "AbortError") setError(true);
      });
    return () => ctrl.abort();
  }, []);

  return (
    <section className="projects-section">
      <div className="projects-head">
        <h2 className="section-title">Projects</h2>
        <a className="projects-profile-link" href={PROFILE_URL} target="_blank" rel="noopener noreferrer">
          @Dekxisosta on GitHub →
        </a>
      </div>

      {error ? (
        <p className="section-empty-state">Couldn&apos;t load repositories from GitHub right now.</p>
      ) : repos === null ? (
        <p className="section-empty-state">Loading repositories…</p>
      ) : repos.length === 0 ? (
        <p className="section-empty-state">No public repositories yet.</p>
      ) : (
        <div className="projects-grid">
          {repos.map((r) => (
            <article key={r.id} className="project-card">
              {r.images?.length > 0 && <ProjectGallery images={r.images} name={r.name} />}
              <div className="project-head">
                <h3 className="project-title">
                  <a href={r.url} target="_blank" rel="noopener noreferrer">{r.name}</a>
                </h3>
                {r.language && <span className="project-lang">{r.language}</span>}
              </div>
              <p className="project-description">{r.description ?? "No description."}</p>

              {r.topics.length > 0 && (
                <div className="project-tags">
                  {r.topics.slice(0, 5).map((t) => <span key={t} className="project-tag">{t}</span>)}
                </div>
              )}

              <Collaborators people={r.collaborators ?? []} />

              <div className="project-meta">
                <span className="project-stat project-stat--star" title="Stars">★ {r.stars}</span>
                <span className="project-stat" title="Forks">⑂ {r.forks}</span>
                <span className="project-meta-date">pushed {timeAgo(r.pushedAt)}</span>
              </div>

              <div className="project-links">
                <a className="project-link" href={r.url} target="_blank" rel="noopener noreferrer">repo →</a>
                {r.homepage && (
                  <a className="project-link project-link--live" href={r.homepage} target="_blank" rel="noopener noreferrer">live →</a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

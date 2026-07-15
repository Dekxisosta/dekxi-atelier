"use client";

import { useEffect, useState } from "react";

const CODEWARS_USERNAME = "Dekxisosta";

export default function CodewarsWidget() {
  const [stats, setStats] = useState<null | {
    rank: string;
    honor: number;
    leaderboardPosition: number | null;
  }>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`https://www.codewars.com/api/v1/users/${CODEWARS_USERNAME}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((d) => {
        if (cancelled) return;
        setStats({
          rank: d?.ranks?.overall?.name ?? "Unranked",
          honor: d?.honor ?? 0,
          leaderboardPosition: d?.leaderboardPosition ?? null
        });
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <p className="widget-fallback">Couldn&apos;t load Codewars stats.</p>;
  }
  if (!stats) {
    return <p className="widget-fallback">Loading stats…</p>;
  }

  return (
    <div className="codewars-stats">
      <div className="codewars-stat-row">
        <span className="codewars-stat-label">Rank</span>
        <span className="codewars-stat-value">{stats.rank}</span>
      </div>
      <div className="codewars-stat-row">
        <span className="codewars-stat-label">Honor</span>
        <span className="codewars-stat-value">{stats.honor.toLocaleString()}</span>
      </div>
      {stats.leaderboardPosition ? (
        <div className="codewars-stat-row">
          <span className="codewars-stat-label">Leaderboard</span>
          <span className="codewars-stat-value">#{stats.leaderboardPosition.toLocaleString()}</span>
        </div>
      ) : null}
      <a
        className="codewars-link"
        href={`https://www.codewars.com/users/${CODEWARS_USERNAME}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View profile →
      </a>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";

const LEETCODE_USERNAME = "Dekxi";

export default function LeetcodeWidget() {
  const [stats, setStats] = useState<null | {
    ranking: number | null;
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
  }>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/leetcode")
        .then((res) => (res.ok ? res.json() : Promise.reject()))
        .then((d) => {
            if (cancelled) return;
            if (d?.error) return Promise.reject();
            setStats({
            ranking: d.ranking,
            totalSolved: d.totalSolved,
            easySolved: d.easySolved,
            mediumSolved: d.mediumSolved,
            hardSolved: d.hardSolved
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
    return <p className="widget-fallback">Couldn&apos;t load LeetCode stats.</p>;
  }
  if (!stats) {
    return <p className="widget-fallback">Loading stats…</p>;
  }

  return (
    <div className="leetcode-stats">
      <div className="leetcode-stat-row">
        <span className="leetcode-stat-label">Solved</span>
        <span className="leetcode-stat-value">{stats.totalSolved.toLocaleString()}</span>
      </div>
      <div className="leetcode-stat-row">
        <span className="leetcode-stat-label">Easy</span>
        <span className="leetcode-stat-value">{stats.easySolved.toLocaleString()}</span>
      </div>
      <div className="leetcode-stat-row">
        <span className="leetcode-stat-label">Medium</span>
        <span className="leetcode-stat-value">{stats.mediumSolved.toLocaleString()}</span>
      </div>
      <div className="leetcode-stat-row">
        <span className="leetcode-stat-label">Hard</span>
        <span className="leetcode-stat-value">{stats.hardSolved.toLocaleString()}</span>
      </div>
      {stats.ranking ? (
        <div className="leetcode-stat-row">
          <span className="leetcode-stat-label">Ranking</span>
          <span className="leetcode-stat-value">#{stats.ranking.toLocaleString()}</span>
        </div>
      ) : null}
      <a
        className="leetcode-link"
        href={`https://leetcode.com/u/${LEETCODE_USERNAME}/`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View profile →
      </a>
    </div>
  );
}
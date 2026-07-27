"use client";

import { useEffect, useState } from "react";
import type { GithubContributionData } from "@/lib/queries/github";

function getIntensityLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

export default function GithubContributionGraph() {
  const [data, setData] = useState<GithubContributionData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/github")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((d: GithubContributionData) => {
        if (!cancelled) setData(d);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <p className="widget-fallback">GitHub activity unavailable right now.</p>;
  }
  if (!data) {
    return <p className="widget-fallback">Loading contribution graph…</p>;
  }

  return (
    <div className="github-graph-wrap">
      <p className="github-graph-total">
        {data.totalContributions} contributions in the last year
      </p>
      <div className="github-graph">
        {data.weeks.map((week, wi) => (
          <div key={wi} className="github-graph-week">
            {week.map((day) => (
              <div
                key={day.date}
                className={`github-graph-day github-graph-level-${getIntensityLevel(day.count)}`}
                title={`${day.count} contributions on ${day.date}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
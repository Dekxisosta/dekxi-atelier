"use client";

import { useEffect, useState } from "react";
import type { DiscordStatusData } from "@/lib/queries/discord";

export default function DiscordWidget() {
  const [data, setData] = useState<DiscordStatusData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchData = () => {
      fetch("/api/discord")
        .then((res) => (res.ok ? res.json() : Promise.reject()))
        .then((d: DiscordStatusData) => {
          if (!cancelled) setData(d);
        })
        .catch(() => {
          if (!cancelled) setError(true);
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (error) {
    return <p className="widget-fallback">Discord status unavailable right now.</p>;
  }
  if (!data) {
    return <p className="widget-fallback">Checking Discord status…</p>;
  }

  return (
    <div className="discord-status">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="discord-avatar" src={data.avatar} alt="" />
      <div className="discord-status-text">
        <p className="discord-status-name">
          {data.username}
          <span className={`discord-dot discord-dot-${data.status}`} />
        </p>
        {data.customStatus ? (
          <p className="discord-status-line">{data.customStatus}</p>
        ) : null}
        {data.activity ? (
          <p className="discord-activity-line">
            {data.activity.details ?? data.activity.name}
          </p>
        ) : null}
      </div>
    </div>
  );
}
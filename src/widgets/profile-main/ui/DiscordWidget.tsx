"use client";

import { useEffect, useState } from "react";
import type { DiscordStatusData } from "@shared/api/discord";

const STATUS_LABEL: Record<string, string> = {
  online: "Online",
  idle: "Idle",
  dnd: "Do Not Disturb",
  offline: "Offline",
};

export default function DiscordWidget() {
  const [data, setData] = useState<DiscordStatusData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchData = () => {
      fetch("/api/discord")
        .then((res) => (res.ok ? res.json() : Promise.reject()))
        .then((d: DiscordStatusData) => { if (!cancelled) setData(d); })
        .catch(() => { if (!cancelled) setError(true); });
    };
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  if (error) {
    return (
      <div className="discord-card discord-card--error" role="status" aria-label="Discord status unavailable">
        <div className="discord-card__avatar-wrap">
          <div className="discord-card__avatar discord-card__avatar--placeholder" />
          <span className="discord-card__status-ring discord-card__status-ring--offline" />
        </div>
        <div className="discord-card__body">
          <p className="discord-card__name">Status unavailable</p>
          <p className="discord-card__custom-status">Couldn't reach Discord right now</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="discord-card discord-card--skeleton" aria-busy="true">
        <div className="discord-card__avatar-wrap">
          <div className="discord-card__avatar discord-card__avatar--placeholder" />
        </div>
        <div className="discord-card__body">
          <div className="discord-skeleton discord-skeleton--name" />
          <div className="discord-skeleton discord-skeleton--line" />
        </div>
      </div>
    );
  }

  const primaryActivity = data.activities[0] ?? null;
  const statusLabel = STATUS_LABEL[data.status] ?? data.status;
  const activityTitle = primaryActivity
    ? [primaryActivity.name, primaryActivity.details, primaryActivity.state].filter(Boolean).join(" · ")
    : undefined;

  return (
    <div className="discord-card">
      <div className="discord-card__avatar-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="discord-card__avatar" src={data.avatar} alt={data.username} />
        <span
          className={`discord-card__status-ring discord-card__status-ring--${data.status}`}
          title={statusLabel}
          aria-label={statusLabel}
        />
      </div>

      <div className="discord-card__body">
        <p className="discord-card__name">
          <span className="discord-card__username">{data.username}</span>
          {data.guildTag && data.guildBadgeUrl ? (
            <span className="discord-card__guild">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="discord-card__guild-badge" src={data.guildBadgeUrl} alt="" />
              {data.guildTag}
            </span>
          ) : null}
        </p>
        {data.customStatus && (
          <p className="discord-card__custom-status" title={data.customStatus}>{data.customStatus}</p>
        )}
        {primaryActivity && (
          <p className="discord-card__activity" title={activityTitle}>
            <span className="discord-card__activity-verb">
              {primaryActivity.type === 0 ? "Playing" : "Doing"}
            </span>
            <span className="discord-card__activity-name">{primaryActivity.name}</span>
          </p>
        )}
        {!data.customStatus && !primaryActivity && (
          <p className="discord-card__custom-status">{statusLabel}</p>
        )}
      </div>
    </div>
  );
}

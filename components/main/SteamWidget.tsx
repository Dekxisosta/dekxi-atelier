"use client";

import { useEffect, useState } from "react";
import type { SteamPlayerData } from "@/lib/queries/steam";

function formatLastOnline(unixSeconds?: number | null): string | null {
  if (!unixSeconds) return null;
  const diffMs = Date.now() - unixSeconds * 1000;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export default function SteamWidget() {
  const [data, setData] = useState<SteamPlayerData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/steam`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((d: SteamPlayerData) => {
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
    return <p className="widget-fallback">Steam status unavailable right now.</p>;
  }
  if (!data) {
    return <p className="widget-fallback">Checking Steam status…</p>;
  }

  const lastOnline = data.status === "Offline" ? formatLastOnline(data.lastLogoff) : null;

  return (
    <div className="steam-status">
      <div className="steam-status-row">
        <a
          href={data.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="steam-status-header"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="steam-avatar" src={data.avatar} alt="" />
          <div className="steam-status-header-text">
            <span className="steam-status-name">{data.name}</span>
            <span className="steam-status-meta">
              {data.countryCode ? (
                <img
                  className="steam-flag"
                  src={`https://flagcdn.com/16x12/${data.countryCode.toLowerCase()}.png`}
                  alt={data.countryCode}
                />
              ) : null}
              <span className="steam-level">Lvl {data.level}</span>
            </span>
          </div>
        </a>

        <p className="steam-status-line">
          {data.status}
          {data.game ? ` · ${data.game}` : ""}
          {lastOnline ? ` · last online ${lastOnline}` : ""}
        </p>
      </div>

      {data.recentGames.length > 0 ? (
        <div className="steam-recent-games">
          <p className="steam-recent-heading">Recently played</p>
          <ul className="steam-recent-list">
            {data.recentGames.map((g) => (
              <li key={g.appid} className="steam-recent-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="steam-recent-icon"
                  src={`https://media.steampowered.com/steamcommunity/public/images/apps/${g.appid}/${g.img_icon_url}.jpg`}
                  alt=""
                />
                <span className="steam-recent-name">{g.name}</span>
                <span className="steam-recent-hours">
                  {(g.playtime_2weeks ?? g.playtime_forever) / 60 | 0}h
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
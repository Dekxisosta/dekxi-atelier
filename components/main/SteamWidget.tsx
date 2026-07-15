"use client";

import { useEffect, useState } from "react";

const STEAM_ID = "YOUR_STEAM_ID";

export default function SteamWidget() {
  const [data, setData] = useState<null | { avatar: string; status: string; game?: string | null }>(
    null
  );
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/steam?steamid=${STEAM_ID}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((d) => {
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

  return (
    <div className="steam-status">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="steam-avatar" src={data.avatar} alt="" />
      <div className="steam-status-text">
        <p className="steam-status-line">{data.status}</p>
        {data.game ? <p className="steam-status-game">{data.game}</p> : null}
      </div>
    </div>
  );
}
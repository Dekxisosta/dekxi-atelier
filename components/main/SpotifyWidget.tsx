"use client";

import { useEffect, useState } from "react";

export default function SpotifyWidget() {
  const [data, setData] = useState<null | {
    isPlaying: boolean;
    title: string;
    artist: string;
    albumArt: string;
    songUrl: string;
  }>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/spotify")
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
    return <p className="widget-fallback">Spotify status unavailable right now.</p>;
  }
  if (!data) {
    return <p className="widget-fallback">Checking what&apos;s playing…</p>;
  }
  if (!data.isPlaying) {
    return <p className="widget-fallback">Not listening to anything right now.</p>;
  }

  return (
    <a className="spotify-now-playing" href={data.songUrl} target="_blank" rel="noopener noreferrer">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="spotify-art" src={data.albumArt} alt="" />
      <div className="spotify-track-text">
        <p className="spotify-track-title">{data.title}</p>
        <p className="spotify-track-artist">{data.artist}</p>
      </div>
      <span className="spotify-eq" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </span>
    </a>
  );
}
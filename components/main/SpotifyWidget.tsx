"use client";

import { useEffect, useState } from "react";
import type { SpotifyTrackData } from "@/lib/queries/spotify";

const POLL_INTERVAL_MS = 15000;

export default function SpotifyWidget() {
  const [data, setData] = useState<SpotifyTrackData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchData = () => {
      fetch("/api/spotify")
        .then((res) => (res.ok ? res.json() : Promise.reject()))
        .then((d: SpotifyTrackData) => {
          if (!cancelled) {
            setData(d);
            setError(false);
          }
        })
        .catch(() => {
          if (!cancelled) setError(true);
        });
    };

    fetchData();
    const interval = setInterval(fetchData, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (error) {
    return <p className="widget-fallback">Spotify status unavailable right now.</p>;
  }
  if (!data) {
    return <p className="widget-fallback">Checking what&apos;s playing…</p>;
  }

  return (
    <div className="spotify-panel">
      {data.isPlaying && data.nowPlaying ? (
        <a
          className="spotify-now-playing"
          href={data.nowPlaying.songUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="spotify-art" src={data.nowPlaying.albumArt} alt="" />
          <div className="spotify-track-text">
            <p className="spotify-track-title">{data.nowPlaying.title}</p>
            <p className="spotify-track-artist">{data.nowPlaying.artist}</p>
          </div>
          <span className="spotify-eq" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </a>
      ) : (
        <p className="widget-fallback">Not listening to anything right now.</p>
      )}

      {data.recentlyPlayed.length > 0 ? (
        <>
          <ul className="spotify-recent-list">
            {data.recentlyPlayed.map((track, i) => (
              <li key={`${track.songUrl}-${i}`}>
                <a
                  className="spotify-recent-item"
                  href={track.songUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="spotify-recent-art" src={track.albumArt} alt="" />
                  <div className="spotify-recent-text">
                    <span className="spotify-recent-title">{track.title}</span>
                    <span className="spotify-recent-artist">{track.artist}</span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
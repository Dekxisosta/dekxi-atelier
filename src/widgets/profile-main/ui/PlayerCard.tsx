"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { GithubStats } from "@shared/api/github";

export const AVATAR = "https://avatars.githubusercontent.com/u/201718391?v=4";
const NAME = "Dekxi";
const NAME_KANA = "デキシ";
/**
 * Event banner shown at the far right of the header; the images rotate.
 * `href` is optional. Use an empty `images` list to hide the banner.
 */
const ANNOUNCEMENT = {
  images: [
    "https://i.ytimg.com/vi/PtzpE8iW6Nw/maxresdefault.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcsrnDtg_DNNqzuY3pa-8-_HKx090ICPTqGzED-jn60C_OT4CKznTNPg&s=10",
  ],
  alt: "Announcement",
  href: "",
  intervalMs: 5000,
};

/** Outline of the gear (100x100 box, evenodd so the middle is a hole). */
const GEAR_PATH =
  "M84.6 44.5 L95.8 45.7 L95.8 54.3 L84.6 55.5 L78.3 70.6 L85.4 79.3 L79.3 85.4 L70.6 78.3 L55.5 84.6 L54.3 95.8 L45.7 95.8 L44.5 84.6 L29.4 78.3 L20.7 85.4 L14.6 79.3 L21.7 70.6 L15.4 55.5 L4.2 54.3 L4.2 45.7 L15.4 44.5 L21.7 29.4 L14.6 20.7 L20.7 14.6 L29.4 21.7 L44.5 15.4 L45.7 4.2 L54.3 4.2 L55.5 15.4 L70.6 21.7 L79.3 14.6 L85.4 20.7 L78.3 29.4 Z M50 36 A14 14 0 1 0 50 64 A14 14 0 1 0 50 36 Z";

/** Below this row width (px) the gear and the announcement banner are hidden, leaving only the status card. */
const COMPACT_BELOW = 900;

/** Tablet and below (matches the layout breakpoint in layout.css): the header is not rendered at all. */
const TABLET_QUERY = "(max-width: 1048px)";

function subscribeTablet(onChange: () => void) {
  const mq = window.matchMedia(TABLET_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

const fmt = (n?: number) => (n === undefined ? "--" : n.toLocaleString("en-US"));

/**
 * Game-style header: character frame, name in katakana and level.
 * Level = number of repositories.
 */
function PlayerCardContent() {
  const [stats, setStats] = useState<GithubStats | null>(null);
  const [slide, setSlide] = useState(0);
  const rowRef = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);

  // hide the gear + banner when the header row itself gets narrow (not only when the viewport does)
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const update = () => setCompact(el.getBoundingClientRect().width < COMPACT_BELOW);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/github/stats")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((d: GithubStats) => { if (!cancelled) setStats(d); })
      .catch(() => { /* leave the placeholders */ });
    return () => { cancelled = true; };
  }, []);

  // rotate the banner images
  useEffect(() => {
    if (ANNOUNCEMENT.images.length < 2) return;
    const id = setInterval(
      () => setSlide((i) => (i + 1) % ANNOUNCEMENT.images.length),
      ANNOUNCEMENT.intervalMs,
    );
    return () => clearInterval(id);
  }, []);

  const bannerContent = (
    <>
      {ANNOUNCEMENT.images.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          className={`announce-strip__img${i === slide ? " is-active" : ""}`}
          src={src}
          alt={i === slide ? ANNOUNCEMENT.alt : ""}
          draggable={false}
        />
      ))}
      <span className="announce-strip__shade" />
      {ANNOUNCEMENT.images.length > 1 && (
        <span className="announce-strip__dots" aria-hidden="true">
          {ANNOUNCEMENT.images.map((src, i) => (
            <span key={src} className={`announce-strip__dot${i === slide ? " is-active" : ""}`} />
          ))}
        </span>
      )}
    </>
  );

  return (
    <div ref={rowRef} className={`player-card-row${compact ? " is-compact" : ""}`}>
      {/* progressive frosted-glass backdrop (desktop only, see nav-menu.css) */}
      <div className="player-card-row__glass" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <section className="player-card" aria-label="Player status">
        <div className="player-card__frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="player-card__avatar" src={AVATAR} alt={NAME} draggable={false} />
        </div>

        <div className="player-card__main">
          <div className="player-card__title-wrap">
            <h2 className="player-card__title" lang="ja" aria-label={NAME} data-text={NAME_KANA}>
              {NAME_KANA}
            </h2>
          </div>
          <span className="player-card__tag">Status</span>
          <div className="player-card__lv" title="Level = number of repositories">
            <span className="player-card__lv-label">LV.</span>
            <span className="player-card__lv-value">{fmt(stats?.repos)}</span>
          </div>
        </div>
      </section>

      <div className="player-card-row__gear-slot">
        <span className="header-gear" aria-hidden="true">
          <svg viewBox="0 0 100 100" className="header-gear__svg" focusable="false">
            <defs>
              <linearGradient id="header-gear-metal" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#f6f8fb" />
                <stop offset="0.35" stopColor="#a7adb8" />
                <stop offset="0.55" stopColor="#e9ecf1" />
                <stop offset="1" stopColor="#6d7380" />
              </linearGradient>
            </defs>
            <path d={GEAR_PATH} fill="url(#header-gear-metal)" fillRule="evenodd" stroke="#3a3845" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      {ANNOUNCEMENT.images.length > 0 && (
        <aside className="announce-strip" aria-label="Announcement">
          {ANNOUNCEMENT.href ? (
            <a
              className="announce-strip__banner"
              href={ANNOUNCEMENT.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {bannerContent}
            </a>
          ) : (
            <div className="announce-strip__banner">{bannerContent}</div>
          )}
        </aside>
      )}
    </div>
  );
}

export default function PlayerCard() {
  // server snapshot is "desktop" so the markup matches on first paint; nav-menu.css hides the row until this settles
  const isTablet = useSyncExternalStore(
    subscribeTablet,
    () => window.matchMedia(TABLET_QUERY).matches,
    () => false,
  );
  if (isTablet) return null;
  return <PlayerCardContent />;
}

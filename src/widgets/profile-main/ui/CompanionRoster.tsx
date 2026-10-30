"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { FriendLinks } from "@entities/friend";
import type { Friend } from "@entities/friend";

const CYCLE_MS = 5000;

/**
 * Background cache. Each url is fetched and decoded once, off the render path;
 * the Image objects are kept alive so the browser holds the decoded bitmap and
 * a later `background-image: url(...)` paints without a network round-trip.
 */
const bgCache = new Map<string, Promise<void>>();

function cacheBackground(url?: string | null): Promise<void> {
  if (!url || typeof window === "undefined") return Promise.resolve();
  const hit = bgCache.get(url);
  if (hit) return hit;

  const img = new Image();
  img.decoding = "async";
  img.src = url;
  const done = (img.decode ? img.decode() : Promise.reject()).catch(
    () =>
      // decode() unsupported or rejected: fall back to the load event
      new Promise<void>((resolve) => {
        if (img.complete) return resolve();
        img.onload = img.onerror = () => resolve();
      })
  );
  bgCache.set(url, done);
  return done;
}

const whenIdle = (cb: () => void) =>
  typeof window.requestIdleCallback === "function"
    ? window.requestIdleCallback(cb, { timeout: 2000 })
    : window.setTimeout(cb, 200);

/**
 * Fighting-game style character select. A grid of icons (each companion's
 * profile picture) sits under a big screen; pressing an icon loads that
 * companion's background and details into the screen.
 */
export default function CompanionRoster({ friends }: { friends: Friend[] }) {
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const gridRef = useRef<HTMLUListElement>(null);

  const count = friends.length;
  const index = count > 0 ? Math.min(selected, count - 1) : 0;

  // advance to the next companion every 5s; the timer restarts whenever the
  // selection changes (manual pick included) and holds while hovered/focused
  useEffect(() => {
    if (count < 2 || paused) return;
    const id = window.setTimeout(() => setSelected((index + 1) % count), CYCLE_MS);
    return () => window.clearTimeout(id);
  }, [index, count, paused]);

  // warm every cover in cycle order (next companion first), one at a time and
  // only when the browser is idle, so it never competes with the first paint
  useEffect(() => {
    let cancelled = false;
    const order = friends.map((_, i) => friends[(index + i) % count].friend_cover_link);
    const queue = order.filter((u, i): u is string => !!u && order.indexOf(u) === i);

    const next = () => {
      const url = queue.shift();
      if (cancelled || !url) return;
      cacheBackground(url).then(() => !cancelled && whenIdle(next));
    };
    whenIdle(next);

    return () => {
      cancelled = true;
    };
    // re-prioritise only when the list changes, not on every selection
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [friends]);

  // and make sure the one about to be shown is ready right away
  useEffect(() => {
    if (count > 1) void cacheBackground(friends[(index + 1) % count].friend_cover_link);
  }, [index, count, friends]);

  // keep the active icon visible when the grid scrolls sideways
  useEffect(() => {
    const grid = gridRef.current;
    const tile = grid?.querySelectorAll<HTMLElement>(".roster-icon")[index];
    if (!grid || !tile) return;
    const left = tile.offsetLeft - grid.offsetLeft;
    if (left < grid.scrollLeft || left + tile.offsetWidth > grid.scrollLeft + grid.clientWidth) {
      grid.scrollTo({ left: left - grid.clientWidth / 2 + tile.offsetWidth / 2, behavior: "smooth" });
    }
  }, [index]);

  if (count === 0) return null;

  const friend = friends[index];

  // arrow keys move the cursor across the grid, like a controller
  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();

    const tiles = gridRef.current?.querySelectorAll<HTMLButtonElement>(".roster-icon");
    if (!tiles || tiles.length === 0) return;

    // how many tiles fit on one row right now
    const firstTop = tiles[0].offsetTop;
    let perRow = 0;
    while (perRow < tiles.length && tiles[perRow].offsetTop === firstTop) perRow++;

    const step =
      e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" ? -perRow : perRow;
    const next = Math.min(Math.max(index + step, 0), friends.length - 1);
    setSelected(next);
    tiles[next].focus();
  };

  return (
    <section
      className="roster"
      aria-label="Companions"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="roster-body">
        {/* backdrop spans the whole container (details + icon grid); key replays the fade on every pick */}
        <div key={friend.id} className="roster-backdrop" aria-hidden="true">
          <div
            className={"roster-bg" + (friend.friend_cover_link ? "" : " roster-bg--empty")}
            style={
              friend.friend_cover_link
                ? { backgroundImage: `url('${friend.friend_cover_link}')` }
                : undefined
            }
          />
          <div className="roster-bg-fade" />
        </div>

      {/* ── Details screen ── */}
      <div className="roster-screen" aria-live="polite">
        {/* key remounts the stage so the entrance animation replays on every pick */}
        <div key={friend.id} className="roster-stage">
          <div className="roster-portrait">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="roster-portrait-img"
              src={friend.friend_profile_picture_link}
              alt={friend.friend_name}
              draggable={false}
            />
          </div>

          <div className="roster-info">
            <h3 className="roster-name">{friend.friend_name}</h3>
            {friend.friend_links && friend.friend_links.length > 0 && (
              <div className="roster-links">
                <FriendLinks links={friend.friend_links} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Icon grid (right side) ── */}
      <ul
        className="roster-grid"
        ref={gridRef}
        onKeyDown={onKeyDown}
        style={{ "--roster-cols": Math.ceil(friends.length / 2) } as CSSProperties}
      >
        {friends.map((f, i) => (
          <li key={f.id} className="roster-cell">
            <button
              type="button"
              className={"roster-icon" + (i === index ? " is-selected" : "")}
              aria-pressed={i === index}
              aria-label={f.friend_name}
              title={f.friend_name}
              tabIndex={i === index ? 0 : -1}
              onClick={() => setSelected(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.friend_profile_picture_link} alt="" draggable={false} />
              {i === index && <span className="roster-cursor" aria-hidden="true">1P</span>}
            </button>
          </li>
        ))}
      </ul>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import DiscordWidget from "./DiscordWidget";

const EMAIL = "rroquxii@gmail.com";
const SWAP_MS = 5000;

/** Discord status and email share one slot and trade places every 5 seconds. */
export default function ContactSwap() {
  const [showEmail, setShowEmail] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setShowEmail((v) => !v), SWAP_MS);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div
      className="contact-swap"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className={"contact-swap__item" + (showEmail ? "" : " is-active")}
        aria-hidden={showEmail}
      >
        <DiscordWidget />
      </div>
      <div
        className={"contact-swap__item" + (showEmail ? " is-active" : "")}
        aria-hidden={!showEmail}
      >
        <a
          className="discord-card contact-swap__email"
          href={`mailto:${EMAIL}`}
          tabIndex={showEmail ? 0 : -1}
        >
          <div className="discord-card__avatar-wrap">
            <div className="discord-card__avatar contact-swap__icon">
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m2 6 10 7 10-7" />
              </svg>
            </div>
          </div>
          <div className="discord-card__body">
            <p className="discord-card__name">Email</p>
            <p className="discord-card__custom-status">{EMAIL}</p>
          </div>
        </a>
      </div>
    </div>
  );
}

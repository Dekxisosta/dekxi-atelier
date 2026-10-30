"use client";

import { useEffect, useState } from "react";

interface TimezoneConfig { label: string; timeZone: string }

const TIMEZONES: TimezoneConfig[] = [
  { label: "PH", timeZone: "Asia/Manila"         },
  { label: "US", timeZone: "America/New_York"    },
  { label: "MX", timeZone: "America/Mexico_City" },
  { label: "CN", timeZone: "Asia/Shanghai"       },
  { label: "VN", timeZone: "Asia/Ho_Chi_Minh"    },
  { label: "PL", timeZone: "Europe/Warsaw"       },
  { label: "ID", timeZone: "Asia/Jakarta"        },
  { label: "TH", timeZone: "Asia/Bangkok"        },
];

const PAGE_SIZE = 4;
const ROTATE_MS = 3000;
const PAGE_COUNT = Math.ceil(TIMEZONES.length / PAGE_SIZE);

function formatTime(timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit", minute: "2-digit", hour12: true, timeZone,
  }).format(new Date());
}

function getOffsetLabel(timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone, timeZoneName: "shortOffset",
  }).formatToParts(new Date());
  return parts.find((p) => p.type === "timeZoneName")?.value.replace("GMT", "GMT ") ?? "";
}

export default function ClockWidget() {
  const [times, setTimes] = useState<Record<string, string>>({});
  const [page, setPage] = useState(0);

  // Swap to the next group of four every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => setPage((p) => (p + 1) % PAGE_COUNT), ROTATE_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const update = () => {
      const next: Record<string, string> = {};
      for (const tz of TIMEZONES) next[tz.label] = formatTime(tz.timeZone);
      setTimes(next);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const visible = TIMEZONES.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="clock-widget">
      {/* key={page} remounts the grid so the fade-in replays on every swap */}
      <div key={page} className="clock-widget-grid clock-widget-grid--page">
        {visible.map((tz) => (
          <div key={tz.label} className="clock-tile" title={`${tz.timeZone} (${getOffsetLabel(tz.timeZone)})`}>
            <span className="clock-tile-label">{tz.label}</span>
            <span className="clock-tile-time">{times[tz.label] ?? "--:--"}</span>
            <span className="clock-tile-offset">{getOffsetLabel(tz.timeZone)}</span>
          </div>
        ))}
      </div>
      <div className="clock-widget-dots" aria-hidden="true">
        {Array.from({ length: PAGE_COUNT }, (_, i) => (
          <span key={i} className={"clock-widget-dot" + (i === page ? " is-active" : "")} />
        ))}
      </div>
    </div>
  );
}

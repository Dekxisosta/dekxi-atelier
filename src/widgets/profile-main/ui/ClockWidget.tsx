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

  return (
    <div className="clock-widget-grid">
      {TIMEZONES.map((tz) => (
        <div key={tz.label} className="clock-tile">
          <span className="clock-tile-label">{tz.label}</span>
          <span className="clock-tile-time">{times[tz.label] ?? "--:--"}</span>
          <span className="clock-tile-offset">{getOffsetLabel(tz.timeZone)}</span>
        </div>
      ))}
    </div>
  );
}

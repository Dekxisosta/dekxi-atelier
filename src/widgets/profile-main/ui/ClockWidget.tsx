"use client";

import { useEffect, useState } from "react";

interface TimezoneConfig { code: string; country: string; timeZone: string }

const TIMEZONES: TimezoneConfig[] = [
  { code: "PH", country: "Philippines",   timeZone: "Asia/Manila"         },
  { code: "US", country: "United States", timeZone: "America/New_York"    },
  { code: "MX", country: "Mexico",        timeZone: "America/Mexico_City" },
  { code: "CN", country: "China",         timeZone: "Asia/Shanghai"       },
  { code: "VN", country: "Vietnam",       timeZone: "Asia/Ho_Chi_Minh"    },
  { code: "PL", country: "Poland",        timeZone: "Europe/Warsaw"       },
  { code: "ID", country: "Indonesia",     timeZone: "Asia/Jakarta"        },
  { code: "TH", country: "Thailand",      timeZone: "Asia/Bangkok"        },
];

const STORAGE_KEY = "clock-country";

function formatTime(timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23", timeZone,
  }).format(new Date());
}

function getOffsetLabel(timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone, timeZoneName: "shortOffset",
  }).formatToParts(new Date());
  return parts.find((p) => p.type === "timeZoneName")?.value.replace("GMT", "GMT ") ?? "";
}

export default function ClockWidget() {
  const [code, setCode] = useState(TIMEZONES[0].code);
  const [time, setTime] = useState("--:--:--");

  // restore the last chosen country
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved && TIMEZONES.some((t) => t.code === saved)) setCode(saved);
    } catch {
      /* storage unavailable: keep the default */
    }
  }, []);

  const tz = TIMEZONES.find((t) => t.code === code) ?? TIMEZONES[0];

  useEffect(() => {
    const update = () => setTime(formatTime(tz.timeZone));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [tz.timeZone]);

  const choose = (next: string) => {
    setCode(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="clock-widget">
      <div className="clock-tile clock-tile--single" title={tz.timeZone}>
        <select
          className="clock-country-select"
          value={code}
          onChange={(e) => choose(e.target.value)}
          aria-label="Country for the clock"
        >
          {TIMEZONES.map((t) => (
            <option key={t.code} value={t.code}>
              {t.country}
            </option>
          ))}
        </select>
        <div className="clock-tile-row">
          <span className="clock-tile-time">{time}</span>
          <span className="clock-tile-offset">{getOffsetLabel(tz.timeZone)}</span>
        </div>
      </div>
    </div>
  );
}

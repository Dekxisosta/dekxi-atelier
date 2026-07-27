"use client";

import { useEffect, useState } from "react";

interface TimezoneConfig {
  label: string;
  timeZone: string;
}

const TIMEZONES: TimezoneConfig[] = [
  { label: "PH", timeZone: "Asia/Manila" },       // GMT+8
  { label: "US", timeZone: "America/New_York" },  // GMT-5/-4 (DST-aware)
  { label: "MX", timeZone: "America/Mexico_City" }, // GMT-6
  { label: "CN", timeZone: "Asia/Shanghai" },      // GMT+8
  { label: "VN", timeZone: "Asia/Ho_Chi_Minh" },   // GMT+7
  { label: "PL", timeZone: "Europe/Warsaw" },      // GMT+1/+2 (DST-aware)
  { label: "ID", timeZone: "Asia/Jakarta" },       // GMT+7
  { label: "TH", timeZone: "Asia/Bangkok" },       // GMT+7
];

function formatTime(timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone,
  }).format(new Date());
}

function getOffsetLabel(timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "shortOffset",
  }).formatToParts(new Date());
  const offsetPart = parts.find((p) => p.type === "timeZoneName");
  return offsetPart?.value.replace("GMT", "GMT ") ?? "";
}

export default function ClockWidget() {
  const [times, setTimes] = useState<Record<string, string>>({});

  useEffect(() => {
    const update = () => {
      const next: Record<string, string> = {};
      for (const tz of TIMEZONES) {
        next[tz.label] = formatTime(tz.timeZone);
      }
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
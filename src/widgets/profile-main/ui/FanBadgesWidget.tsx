const BADGES = [
  "K-On", "Steins;Gate", "Re:Zero", "Little Witch Academia", "Mushoku Tensei", "NGE", "MGRP",
  "Limbus Company", "Needy Streamer OD", "DDLC", "Arcaea", "R1999",
  "Ninomae Inanis", "Hoshimachi Suisei", "Pipkin Pippa",
  "Mili", "r-906", "MORE MORE JUMP!", "Kasane Teto", "Hatsune Miku",
  "Milgram", "TADC", "Murder Drones", "Spiderverse",
];

export default function FanBadgesWidget() {
  return (
    <div className="affiliations-badges">
      {BADGES.map((label) => (
        <span key={label} className="affiliation-badge">{label}</span>
      ))}
    </div>
  );
}

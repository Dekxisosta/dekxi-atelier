import { TECH_STACK, DEVICON, INVERTED } from "@entities/profile";

const EXTRA_CHIPS: { src: string; alt: string; invert?: boolean }[] = [
  { src: "https://railway.app/brand/logo-light.png", alt: "Railway" },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Roblox_Studio_logo.svg/512px-Roblox_Studio_logo.svg.png",
    alt: "Roblox Studio",
    invert: true,
  },
];

function ChipSet() {
  return (
    <>
      {TECH_STACK.map(([slug, alt]) => (
        <div className="tech-chip" key={slug}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={DEVICON(slug)}
            alt={alt}
            style={INVERTED.has(slug) ? { filter: "invert(1) opacity(0.85)" } : undefined}
          />
        </div>
      ))}
      {EXTRA_CHIPS.map(({ src, alt, invert }) => (
        <div className="tech-chip" key={alt}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            style={invert ? { filter: "invert(1) opacity(0.85)" } : undefined}
          />
        </div>
      ))}
    </>
  );
}

export default function TechChips() {
  // Two identical sets so translateX(-50%) loops seamlessly
  return (
    <>
      <ChipSet />
      <ChipSet />
    </>
  );
}

import { TECH_STACK, DEVICON, INVERTED } from "@/lib/data/tech-stack";

export default function TechChips() {
  const chips = [...TECH_STACK, ...TECH_STACK];
  return (
    <>
      {chips.map(([slug, alt], i) => (
        <div className="tech-chip" key={`${slug}-${i}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={DEVICON(slug)}
            alt={alt}
            style={INVERTED.has(slug) ? { filter: "invert(1) opacity(0.85)" } : undefined}
          />
        </div>
      ))}
      <div className="tech-chip">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://railway.app/brand/logo-light.png" alt="Railway" />
      </div>
      <div className="tech-chip">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Roblox_Studio_logo.svg/512px-Roblox_Studio_logo.svg.png"
          alt="Roblox Studio"
          style={{ filter: "invert(1) opacity(0.85)" }}
        />
      </div>
    </>
  );
}
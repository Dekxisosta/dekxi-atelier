import { TECH_STACK, DEVICON, INVERTED } from "@entities/profile";
import { EXTRA_CHIPS } from "./TechChips";

/** The tech stack as a compact ledger: one icon + name per entry. */
export default function StackLedger() {
  return (
    <ul className="stack-ledger">
      {TECH_STACK.map(([slug, name]) => (
        <li className="stack-ledger-item" key={slug}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={DEVICON(slug)}
            alt=""
            style={INVERTED.has(slug) ? { filter: "invert(1) opacity(0.85)" } : undefined}
          />
          <span>{name}</span>
        </li>
      ))}
      {EXTRA_CHIPS.map(({ src, alt, invert }) => (
        <li className="stack-ledger-item" key={alt}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" style={invert ? { filter: "invert(1) opacity(0.85)" } : undefined} />
          <span>{alt}</span>
        </li>
      ))}
    </ul>
  );
}

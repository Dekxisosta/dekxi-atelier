const ORGS = [
  { name: "Café Camellia", logo: "/assets/logos/cafe-camellia.webp" },
  { name: "AWSSBG-UC", logo: "/assets/logos/chip.webp" },
  { name: "KNR Collective", logo: "/assets/logos/knr.webp" },
];

export default function InterestsSection() {
  return (
    <div className="interests-section">
      <h3 className="interests-heading">Organizations</h3>
      <div className="interests-pills-wrap">
        {ORGS.map((org) => (
          <span key={org.name} className="interest-pill interest-pill--org">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="interest-pill__logo" src={org.logo} alt="" draggable={false} />
            {org.name}
          </span>
        ))}
      </div>

      <h3 className="interests-heading">Titles</h3>
      <div className="interests-pills-wrap">
        <span className="interest-pill">Chief Technology Officer - AWSSBG UC</span>
        <span className="interest-pill">SDD Head</span>
        <span className="interest-pill">SBD Head</span>
        <span className="interest-pill">VGen Artist</span>
        <span className="interest-pill">Roblox Developer</span>
        <span className="interest-pill">Aspiring SWE</span>
        <span className="interest-pill">Digital Art</span>
        <span className="interest-pill">Character Design</span>
        <span className="interest-pill">Game Development</span>
        <span className="interest-pill">Open Source</span>
        <span className="interest-pill">Freelance Artist </span>
        <span className="interest-pill">Indie Games</span>
      </div>
    </div>
  );
}
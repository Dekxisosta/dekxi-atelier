import TechChips from "@/components/main/TechChips";
import { PROFILE_LINKS } from "@/lib/data/profile-links";

export default function ProfileHeader() {
  return (
    <div className="profile-header-container">
      <div className="header-banner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="clockwise-tracker"
          src="https://media.tenor.com/W85ad914NFcAAAAj/limbus-limbus-company.gif"
          alt="Moving Tracker"
        />
      </div>

      <div className="techstack-section">
        <div className="techstack-track-wrap">
          <div className="techstack-fade techstack-fade-left"></div>
          <div className="techstack-track-outer">
            <div className="techstack-track" id="techTrack">
              <TechChips />
            </div>
          </div>
          <div className="techstack-fade techstack-fade-right"></div>
        </div>
      </div>

      <div className="profile-links">
        <div className="profile-link-plain">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="profile-link-icon"
            src="https://static.wikia.nocookie.net/limbuscompany/images/c/ca/Ishmael_Icon.png/revision/latest/scale-to-width/360?cb=20230310043907"
            alt="Ishmael"
          />
        </div>
        {PROFILE_LINKS.map((link) => (
          <a
            key={link.label}
            className="profile-link"
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="profile-link-icon-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="profile-link-icon" src={link.icon} alt={link.label} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="profile-link-frame" src={link.frame} alt="" />
            </div>
            <span className="profile-link-label">{link.label}</span>
          </a>
        ))}
      </div>

      <div className="profile-meta-row">
        <div className="avatar-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="avatar"
            src="https://avatars.githubusercontent.com/u/201718391?v=4"
            alt="Dekxi"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="avatar-gif"
            src="https://64.media.tumblr.com/7ea97be03c01198118541c21c6d9a930/9ae2b653243aa457-1a/s400x600/7d1a61c36da80ac0f1e6a40c52d4e121d16d33ed.gif"
            alt=""
          />
        </div>
        <div className="profile-text-identity">
          <div className="profile-name-row">
            <h1 className="hero-name">dekxi</h1>
            <p className="hero-handle">@dekxisosta</p>
          </div>
          <div className="profile-bio-row">
            <p className="hero-bio">
              Nyahallo, dear reader~ A <strong>coder</strong> by contract, an{" "}
              <strong>artist</strong> by ego. Currently indebted to Roblox Studio and running
              on distorted sleep schedules. <br />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
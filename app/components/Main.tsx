const TECH_STACK = [
  ["html5", "HTML5"],
  ["css3", "CSS3"],
  ["javascript", "JavaScript"],
  ["typescript", "TypeScript"],
  ["python", "Python"],
  ["lua", "Lua"],
  ["java", "Java"],
  ["csharp", "C#"],
  ["react", "React"],
  ["nextjs", "Next.js"],
  ["astro", "Astro"],
  ["vite", "Vite"],
  ["tailwindcss", "Tailwind"],
  ["bootstrap", "Bootstrap"],
  ["sass", "SCSS"],
  ["nodejs", "Node.js"],
  ["spring", "Spring Boot"],
  ["laravel", "Laravel"],
  ["postgresql", "PostgreSQL"],
  ["mysql", "MySQL"],
  ["sqlite", "SQLite"],
  ["mongodb", "MongoDB"],
  ["supabase", "Supabase"],
  ["git", "Git"],
  ["github", "GitHub"],
  ["vercel", "Vercel"],
  ["figma", "Figma"],
  ["canva", "Canva"],
  ["notion", "Notion"]
] as const;

const DEVICON = (name: string) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name}/${name}-original.svg`;

const INVERTED = new Set(["nextjs", "astro", "vercel", "notion", "github"]);

function TechChips() {
  const chips = [...TECH_STACK, ...TECH_STACK]; // duplicated for seamless marquee loop
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

const PROFILE_FRAME =
  "https://64.media.tumblr.com/640311df2c6bdb2e5c66a97bfd17afc1/a3281023730255e4-07/s400x600/848dc29a138815316fbc1b608478d5336e0bbf92.png";

const LINK_FRAME =
  "https://giftadmin.incodeslab.com/api/media/outputs/ornate-red-frame-original.gif";

const LINK_FRAME_ALT =
  "https://64.media.tumblr.com/34d1d4b86144179e50234f51db59f8ee/a3281023730255e4-2f/s400x600/224188bde56cea65bf659eeaccb60ca301d67b00.png";

const PROFILE_LINKS = [
  {
    href: "https://bsky.app/profile/rroquxii.bsky.social",
    label: "Bluesky",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Bluesky_Logo.svg/1280px-Bluesky_Logo.svg.png",
    frame: PROFILE_FRAME
  },
  {
    href: "https://x.com/rroquxii56443",
    label: "Twitter",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/X_logo.jpg/1280px-X_logo.jpg",
    frame: PROFILE_FRAME
  },
  {
    href: "https://www.facebook.com/dekxisosta/",
    label: "FB",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/1280px-Facebook_f_logo_%282019%29.svg.png",
    frame: PROFILE_FRAME
  },
  {
    href: "https://www.instagram.com/wroquxshii/?hl=en",
    label: "IG",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/3840px-Instagram_logo_2016.svg.png",
    frame: PROFILE_FRAME
  },
  {
    href: "https://www.tiktok.com/@YOUR_HANDLE",
    label: "TikTok",
    icon: "https://www.pngall.com/wp-content/uploads/13/TikTok-Logo-PNG-Clipart.png",
    frame: PROFILE_FRAME
  },
  {
    href: "https://ko-fi.com/YOUR_HANDLE",
    label: "Ko-fi",
    icon: "https://img.icons8.com/color/512/ko-fi.png",
    frame: PROFILE_FRAME
  }
];

const CONTENT_LINKS = [
  {
    href: "https://www.linkedin.com/in/nel-xedrik-ariscon-9b7a40387/",
    icon: "https://images.icon-icons.com/2429/PNG/512/linkedin_logo_icon_147268.png",
    alt: "LinkedIn",
    frame: LINK_FRAME
  },
  {
    href: "https://github.com/Dekxisosta",
    icon: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    alt: "GitHub",
    invert: true,
    frame: LINK_FRAME
  },
  {
    href: "#",
    icon: "https://static.wikia.nocookie.net/logopedia/images/a/a7/Vercel_favicon.svg/revision/latest?cb=20221026155821",
    alt: "Portfolio",
    invert: true,
    frame: LINK_FRAME
  },
  {
    href: "https://youtube.com/Rroquxii",
    icon: "https://static.vecteezy.com/system/resources/thumbnails/042/127/234/small/white-square-bordered-youtube-logo-on-transparent-background-free-png.png",
    alt: "Youtube",
    frame: LINK_FRAME_ALT
  },
  {
    href: "https://bsky.app/profile/rroquxii.bsky.social",
    icon: "https://images-eds-ssl.xboxlive.com/image?url=4rt9.lXDC4H_93laV1_eHM0OYfiFeMI2p9MWie0CvL99U4GA1gf6_kayTt_kBblFwHwo8BW8JXlqfnYxKPmmBSbGlig3QxCGH5S1P6VGKEnvZXXeY4ddR9M_psIqmAXGIqwEZ5x5JvLgaY55WyWFl0KzLcenQUcuXhw9W8.BBzE-&format=source",
    alt: "Art Commissions",
    frame: LINK_FRAME_ALT
  },
  {
    href: "#",
    icon: "https://devforum-uploads.s3.dualstack.us-east-2.amazonaws.com/uploads/original/4X/5/2/b/52bce3b02f6c5dddf9dfd5390fa00a9b2be6fa38.png",
    alt: "Roblox Dev",
    frame: LINK_FRAME_ALT
  },
  {
    href: "mailto:rroquxii@email.com",
    icon: "https://static.vecteezy.com/system/resources/previews/022/613/021/non_2x/google-mail-gmail-icon-logo-symbol-free-png.png",
    alt: "Contact",
    frame: LINK_FRAME_ALT
  }
];

export default function Main() {
  return (
    <div className="container-main" id="profile-view">
      {/* LEFT COLUMN */}
      <div className="main-left">
        <div className="ornate-navbar">
          <div className="ornate-navbar-corner ornate-navbar-corner-left"></div>
          <div className="ornate-navbar-line">
            <span className="ornate-navbar-label">E.G.O // PERSONAL FILE</span>
          </div>
          <div className="ornate-navbar-corner ornate-navbar-corner-right"></div>
        </div>

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

        <div className="interests-section">
          <div className="interests-pills-wrap">
            <span className="interest-pill">Full-Stack Development</span>
            <span className="interest-pill">Game Mechanics</span>
            <span className="interest-pill">UI / UX Design</span>
            <span className="interest-pill">System Architecture</span>
            <span className="interest-pill">Digital Illustration</span>
            <span className="interest-pill">Productivity Workflows</span>
          </div>
        </div>

        <div className="content content-grid">
          {CONTENT_LINKS.map((link) => (
            <a
              key={link.alt}
              className="link-card visible"
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              <div className="link-icon-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="link-icon"
                  src={link.icon}
                  alt={link.alt}
                  style={link.invert ? { filter: "invert(1) opacity(0.85)" } : undefined}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="link-frame" src={link.frame} alt="" />
              </div>
            </a>
          ))}
        </div>
        <div className="footer"></div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="main-right">
        <div className="about-section about-two-col">
          <div>
            <h3 className="about-subheading">BYF !!!</h3>
            <p className="about-text">
              eng twts, doesn&apos;t answer dms fast, tw/cw likes 18+ content, self-deprecation
              jokes
            </p>
          </div>
          <div>
            <h3 className="about-subheading">DNI !!</h3>
            <p className="about-text">basic dni criteria · if you hate any of my favs. Below 18</p>
          </div>
        </div>

        <div className="about-section about-two-col">
          <div>
            <h3 className="about-subheading">anime</h3>
            <p className="about-text">
              Little Witch Academia, Marriage Toxin, K-On, Another, NGE, Steins;Gate, BTR, Re:Zero,{" "}
            </p>
          </div>
          <div>
            <h3 className="about-subheading">vtubers</h3>
            <p className="about-text">
              Usada Pekora, Houshou Marine, Reimu Endou, Kana Rheia, Delutaya, Rina Lucsper
            </p>
          </div>
        </div>

        <div className="about-section about-two-col">
          <div>
            <h3 className="about-subheading">games</h3>
            <p className="about-text">
              Osu, FF, PGR, Azur Lane, DDLC, Roblox, Terraria, pjsk, bandori, Arcaea
            </p>
          </div>
          <div>
            <h3 className="about-subheading">music</h3>
            <p className="about-text">
              ado, wanuka, t+pazolite, kikuo, inabakumori, aiobahn, ZTMY, r-906, tokyo manaka
            </p>
          </div>
        </div>

        <div className="about-section about-two-col">
          <div>
            <h3 className="about-subheading">manhwa</h3>
            <p className="about-text">Ctrl+Alt+Resign, Unemployed Gye Baeksun</p>
          </div>
          <div>
            <h3 className="about-subheading">others</h3>
            <p className="about-text">
              Spiderverse, Milgram, KOG, TADC, Gameoverse, Murder Drones
            </p>
          </div>
        </div>

        <div className="about-img-full"></div>
        <div className="about-collab">
          <p className="about-collab-text">
            Open to collaborating on projects across these domains — whether it&apos;s a side
            project, open source contribution, or something you&apos;re building from scratch.
          </p>
          <div className="about-collab-contact">
            <a href="https://discord.com" className="about-collab-link">
              <span className="about-collab-icon">💬</span>
              <span className="about-collab-link-text">@miyuacchiii</span>
            </a>
            <a href="mailto:rroquxii@gmail.com" className="about-collab-link">
              <span className="about-collab-icon">📧</span>
              <span className="about-collab-link-text">rroquxii@gmail.com</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
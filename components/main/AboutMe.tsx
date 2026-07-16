function GoldTube() {
  return (
    <div className="gold-tube">
      <div className="gold-tube-texture" />
      <div className="gold-tube-shine" />
    </div>
  );
}

function GoldRod() {
  return (
    <div className="gold-rod">
      <div className="gold-rod-shine" />
    </div>
  );
}

export default function AboutMe() {
  return (
    <div className="main-center">
      <div className="affiliations-banner">
        <div className="affiliations-badges">
          <span className="affiliation-badge">Roblox Studio</span>
          <span className="affiliation-badge">Digital Artist</span>
          <span className="affiliation-badge">Limbus Company</span>
          <span className="affiliation-badge">Miku fan!</span>
        </div>
      </div>

      <div className="about-section-wrap">
        <GoldTube />
        <GoldRod />
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
      </div>

      <div className="about-section-wrap">
        <GoldTube />
        <GoldRod />
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
      </div>

      <div className="about-section-wrap">
        <GoldTube />
        <GoldRod />
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
      </div>

      <div className="about-section-wrap">
        <GoldTube />
        <GoldRod />
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
      </div>
    </div>
  );
}
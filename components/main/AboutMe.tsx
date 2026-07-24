const CONFETTI_BORDER_SRC =
  "https://static.wikia.nocookie.net/projectsekai/images/4/41/Confetti_Title_Border.png/revision/latest/scale-to-width-down/180?cb=20231110092810";

interface FanTitleProps {
  src: string;
  alt?: string;
}

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


function FanTitle({ src, alt = "" }: FanTitleProps) {
  return (
    <div className="fan-title-frame">
      <img src={src} alt={alt} />
      <img src={CONFETTI_BORDER_SRC} alt="" className="fan-title-confetti" />
    </div>
  );
}
export default function AboutMe() {
  return (
    <div className="main-center">
      <div className="affiliations-banner">
        <div className="affiliations-badges">
          <FanTitle src="https://static.wikia.nocookie.net/projectsekai/images/7/7d/Airi_Fan_Title.png/revision/latest/scale-to-width-down/180?cb=20220624221443" />
          <FanTitle src="https://static.wikia.nocookie.net/projectsekai/images/5/59/Nene_Fan_Title.png/revision/latest/scale-to-width-down/180?cb=20220624221919" />
          <FanTitle src="https://static.wikia.nocookie.net/projectsekai/images/8/85/Mafuyu_Fan_Title.png/revision/latest/scale-to-width-down/180?cb=20220624222043" />
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
              eng twts, tw/cw <b>NSFW artist</b>, self-deprecation (sometimes), <b>doesn't answer dms fast</b>
            </p>
          </div>
          <div>
            <h3 className="about-subheading">DNI !!</h3>
            <p className="about-text">
              basic dni criteria · <b>if you hate any of my favs</b>. Below 18. main character syndrome. politics-heavy discussions. <b>stan culture toxicity</b>
            </p>
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
              Little Witch Academia, Mushoku Tensei, Marriage Toxin, <b>K-On</b>, Another, NGE, You and I are Polar Opposites, My Dress-up Darling, Steins;Gate, BTR, Re:Zero
            </p>
          </div>
          <div>
            <h3 className="about-subheading">vtubers</h3>
            <p className="about-text">
              <b>Ninomae Inanis</b>, Kuri Kitte, Pipkin Pippa, Enna Alouette, Nekomata Okayu, Rina Lucsper, <b>Hoshimachi Suisei</b>
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
              Arcaea, Broken Harmony, Needy Streamer Overload, DDLC, <b>Limbus Company</b>, R1999, PGR, Guardian Tales
            </p>
          </div>
          <div>
            <h3 className="about-subheading">music</h3>
            <p className="about-text">
              Ado, AnythingBecomeMoe, <b>Mili</b>, Flavor Foley, PSYQUI, t+pazolite, Tanchiky, <b>r-906</b>, Sakuzyo, Hoshimachi Suisei, MORE MORE JUMP!            </p>
          </div>
        </div>
      </div>

      <div className="about-section-wrap">
        <GoldTube />
        <GoldRod />
        <div className="about-section about-two-col">
          <div>
            <h3 className="about-subheading">Vocaloid</h3>
            <p className="about-text">Ctrl+Alt+Resign, Unemployed Gye Baeksun</p>
          </div>
          <div>
            <h3 className="about-subheading">others</h3>
            <p className="about-text">
              <b>Vocaloid</b>, Spiderverse, Milgram, KOG, TADC, Gameoverse, Murder Drones
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
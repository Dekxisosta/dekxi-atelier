import SteamWidget from "@/components/main/SteamWidget";
import SpotifyWidget from "@/components/main/SpotifyWidget";
import CodewarsWidget from "@/components/main/CodewarsWidget";
import BlogList from "@/components/main/BlogList";

export default function Sidebar() {
  return (
    <div className="main-right">
      <h1>LIMBUS COMPANY</h1>

      <div className="sidebar-portrait-wrap">
        <div
          className="sidebar-portrait"
          style={{
            backgroundImage: "url(/assets/images/don-quixote-portrait.webp)"
          }}
        />
      </div>

      <div className="widget-panel widget-panel--steam">
        <h3 className="widget-subheading">steam</h3>
        <SteamWidget />
      </div>
      <div className="widget-panel widget-panel--spotify">
        <h3 className="widget-subheading">spotify</h3>
        <SpotifyWidget />
      </div>
      <div className="widget-panel widget-panel--codewars">
        <h3 className="widget-subheading">codewars</h3>
        <CodewarsWidget />
      </div>
      <div className="widget-panel widget-panel--blog">
        <h3 className="widget-subheading">latest posts</h3>
        <BlogList />
      </div>

      <div className="about-collab">
        <div className="about-collab-header">
          <span className="about-collab-header-label">reach out</span>
          <span className="about-collab-header-line" />
        </div>

        <p className="about-collab-text">Open to side projects and open source work.</p>

        <div className="about-collab-contact">
          <a href="https://discord.com" className="about-collab-link">
            <span className="about-collab-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                <path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.028C.533 9.09-.32 13.68.099 18.21a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .078-.01c3.928 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.01c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.891.076.076 0 0 0-.04.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.029 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.055c.5-5.177-.838-9.674-3.549-13.813a.06.06 0 0 0-.031-.029ZM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.955 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z" />
              </svg>
            </span>
            <span className="about-collab-link-text">@miyuacchiii</span>
          </a>

          <a href="mailto:rroquxii@gmail.com" className="about-collab-link">
            <span className="about-collab-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m2 6 10 7 10-7" />
              </svg>
            </span>
            <span className="about-collab-link-text">rroquxii@gmail.com</span>
          </a>
        </div>
      </div>
    </div>
  );
}
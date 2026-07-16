import SteamWidget from "@/components/main/SteamWidget";
import SpotifyWidget from "@/components/main/SpotifyWidget";
import CodewarsWidget from "@/components/main/CodewarsWidget";
import BlogList from "@/components/main/BlogList";

export default function Sidebar() {
  return (
    <div className="main-right">
      <h1>LIMBUS COMPANY</h1>
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
        <p className="about-collab-text">
          Open to collaborating on projects across these domains — whether it&apos;s a side
          project, open source contribution, or something you&apos;re building from scratch.
        </p>
        <div className="about-collab-contact">
          <a href="https://discord.com" className="about-collab-link">
            <span className="about-collab-icon">💬</span>
            <span className="about-collab-link-text">@miyuacchiii</span>
          </a>
        </div>
      </div>
    </div>
  );
}
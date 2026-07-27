import ChibiDock from "@/components/main/ChibiDock";
import ProfileHeader from "@/components/main/ProfileHeader";
import InterestsSection from "@/components/main/InterestsSection";
import ContentGrid from "@/components/main/ContentGrid";
import AboutMe from "@/components/main/AboutMe";
import Sidebar from "@/components/main/Sidebar";
import GithubContributionGraph from "@/components/main/GithubContributionGraph";
import ClockWidget from "@/components/main/ClockWidget";

export default function Main() {
  return (
    <div className="container-main" id="profile-view">
      <div className="main-left">
        <div className="main-left-dock">
          <ChibiDock />
        </div>

        <div className="main-left-content">
          <h1 className="motto" data-text="BLIND OBSESSION">BLIND OBSESSION - ISHMAEL</h1>
          <ProfileHeader />
          <InterestsSection />
          <ContentGrid />

          <div className="github-graph-section">
            <p className="widget-subheading">Contribution Activity</p>
            <GithubContributionGraph />
          </div>

          <div className="clock-section">
            <p className="widget-subheading">World Clock</p>
            <ClockWidget />
          </div>
          <div className="footer"></div>
        </div>
      </div>

      <AboutMe />
      <Sidebar />
    </div>
  );
}
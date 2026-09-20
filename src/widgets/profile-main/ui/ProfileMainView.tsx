import ChibiDock from "./ChibiDock";
import ProfileHeader from "./ProfileHeader";
import InterestsSection from "./InterestsSection";
import ContentGrid from "./ContentGrid";
import AboutMe from "./AboutMe";
import Sidebar from "./Sidebar";
import GithubContributionGraph from "./GithubContributionGraph";
import ClockWidget from "./ClockWidget";
import CharacterBanner from "./CharacterBanner";

export default function ProfileMainView() {
  return (
    <div className="container-main" id="profile-view">
      <div className="main-left">
        <div className="main-left-dock">
          <ChibiDock />
        </div>

        <div className="main-left-content">
          <CharacterBanner />
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
          <div className="footer" />
        </div>
      </div>

      <AboutMe />
      <Sidebar />
    </div>
  );
}

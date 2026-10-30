import CompanionRoster from "./CompanionRoster";
import CharacterPanel from "./CharacterPanel";
import SocialLinks from "./SocialLinks";
import type { ReactNode } from "react";
import type { Tab } from "@shared/config/tabs";
import type { Friend } from "@entities/friend";

type ProfileMainViewProps = {
  onTabChange?: (tab: Tab) => void;
  friends?: Friend[];
  /** Tab content, rendered in the space under the companion roster. */
  children?: ReactNode;
};

export default function ProfileMainView({ onTabChange, friends = [], children }: ProfileMainViewProps) {
  return (
    <div className="container-main" id="profile-view">
      <div className="main-left">
        <div className="main-left-content">
          <SocialLinks />
          <CharacterPanel onTabChange={onTabChange} />
        </div>
      </div>

      <div className="main-center">
        <CompanionRoster friends={friends} />

        {children && <div className="tab-panel">{children}</div>}

        <div className="footer" />
      </div>
    </div>
  );
}

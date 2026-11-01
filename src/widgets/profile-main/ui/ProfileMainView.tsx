import CharacterPanel from "./CharacterPanel";
import SocialLinks from "./SocialLinks";
import PlayerCard, { AVATAR } from "./PlayerCard";
import SideTexture from "./SideTexture";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import type { Tab } from "@shared/config/tabs";
import type { Friend } from "@entities/friend";

/**
 * full    – desktop: character + header + tab content side by side
 * home    – tablet and below: only the character page, tab content is not rendered
 * content – tablet and below: only the opened tab's content, with a back button
 */
export type ProfileMainMode = "full" | "home" | "content";

type ProfileMainViewProps = {
  mode?: ProfileMainMode;
  /** Back button handler (content mode). */
  onBack?: () => void;
  /** Name of the open tab, shown in the content-mode navbar. */
  title?: string;
  onTabChange?: (tab: Tab) => void;
  friends?: Friend[];
  /** Tab content, rendered under the player card. */
  children?: ReactNode;
};

export default function ProfileMainView({ onTabChange, friends = [], children, mode = "full", onBack, title }: ProfileMainViewProps) {
  return (
    <div className="container-main" id="profile-view" data-mode={mode}>
      <SideTexture active={mode === "home"} />

      {mode !== "content" && (
        <div className="main-left">
          <div className="main-left-content">
            <SocialLinks />
            <CharacterPanel onTabChange={onTabChange} friends={friends} />
          </div>
        </div>
      )}

      <div className="main-center">
        <PlayerCard />

        {mode === "content" && (
          <nav className="tab-nav" aria-label="Page navigation">
            <button type="button" className="tab-nav__back" onClick={onBack}>
              <span className="tab-nav__back-inner">
                <ArrowLeft size={14} strokeWidth={3} aria-hidden="true" />
                <span>Back</span>
              </span>
            </button>
            {title && <span className="tab-nav__tag">{title}</span>}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="tab-nav__avatar" src={AVATAR} alt="Dekxi" draggable={false} />
          </nav>
        )}

        {children && <div className="tab-panel">{children}</div>}

        <div className="footer" />
      </div>
    </div>
  );
}

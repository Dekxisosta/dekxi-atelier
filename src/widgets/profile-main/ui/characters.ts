import type { ComponentType } from "react";
import { DON_QUIXOTE, FRIEDRICH, ISHMAEL, JAVELIN, LAFFEY, PRINZ_EUGEN_MU } from "@entities/profile";
import type { ThemeKey } from "@shared/ui/ThemeContext";
import IshmaelStage from "./IshmaelStage";
import DonQuixoteStage from "./DonQuixoteStage";
import FriedrichStage from "./FriedrichStage";
import JavelinStage from "./JavelinStage";
import LaffeyStage from "./LaffeyStage";
import PrinzEugenMuStage from "./PrinzEugenMuStage";

export type CharacterEntry = {
  /** Stable id – persisted per theme, so never rename one once shipped. */
  id: string;
  name: string;
  icon: string;
  Stage: ComponentType;
};

export type ThemeRoster = {
  /** Shown as the header of the character picker. */
  franchise: string;
  /** The first entry is the default. */
  characters: readonly CharacterEntry[];
};

/**
 * Characters available in each theme, grouped under the theme's franchise.
 * To add a character: build its Stage component, then append an entry to that theme's
 * `characters` – the picker (person icon, bottom-right of the stage) lists it automatically.
 * Themes without an entry (moonlight, rosewood) have no character stage.
 */
export const THEME_ROSTERS: Partial<Record<ThemeKey, ThemeRoster>> = {
  azurlane: {
    franchise: "Azur Lane",
    characters: [
      { id: "javelin", name: JAVELIN.name, icon: JAVELIN.icon, Stage: JavelinStage },
      { id: "laffey", name: LAFFEY.name, icon: LAFFEY.icon, Stage: LaffeyStage },
      { id: "friedrich", name: FRIEDRICH.name, icon: FRIEDRICH.icon, Stage: FriedrichStage },
      { id: "prinz-eugen-mu", name: PRINZ_EUGEN_MU.name, icon: PRINZ_EUGEN_MU.icon, Stage: PrinzEugenMuStage },
    ],
  },
  ishmael: {
    franchise: "Limbus Company",
    characters: [
      { id: "ishmael", name: ISHMAEL.name, icon: ISHMAEL.icon, Stage: IshmaelStage },
      { id: "don-quixote", name: DON_QUIXOTE.name, icon: DON_QUIXOTE.icon, Stage: DonQuixoteStage },
    ],
  },
};

"use client";

import { useCallback, useState } from "react";
import { useTheme, type ThemeKey } from "@shared/ui/ThemeContext";
import type { Tab } from "@shared/config/tabs";
import ClockWidget from "./ClockWidget";
import DiscordWidget from "./DiscordWidget";
import CharacterToggle from "./CharacterToggle";
import { THEME_ROSTERS } from "./characters";
import NavMenu from "./NavMenu";
import NavWidgetButton from "./NavWidgetButton";
import StackLedger from "./StackLedger";

const characterKey = (theme: ThemeKey) => `character:${theme}`;

function readStoredCharacter(theme: ThemeKey): string | null {
  try {
    return localStorage.getItem(characterKey(theme));
  } catch {
    return null; // storage unavailable
  }
}

export default function CharacterPanel({ onTabChange }: { onTabChange?: (tab: Tab) => void }) {
  const { theme } = useTheme();
  // chosen character id per theme (the provider only renders on the client, so storage is readable here)
  const [choices, setChoices] = useState<Partial<Record<ThemeKey, string>>>({});

  const roster = THEME_ROSTERS[theme];
  const characters = roster?.characters ?? [];
  const wanted = choices[theme] ?? readStoredCharacter(theme);
  const active = characters.find((c) => c.id === wanted) ?? characters[0];

  const selectCharacter = useCallback(
    (id: string) => {
      setChoices((prev) => ({ ...prev, [theme]: id }));
      try {
        localStorage.setItem(characterKey(theme), id);
      } catch {
        /* storage unavailable */
      }
    },
    [theme]
  );

  return (
    <div className="character-panel">
      <div className="clock-section">
        <header className="home-port">
          <h2 className="home-port-title">Dekxi&apos;s Atelier</h2>
          <span className="home-port-sub">Home Port</span>
        </header>
        <div className="clock-row">
          <div className="arsenal-col">
            <NavWidgetButton
              variant="block"
              label="Arsenal"
              sub="stack ledger"
              heading="Stack Ledger"
              width={360}
            >
              <StackLedger />
            </NavWidgetButton>
          </div>
          <div className="discord-col">
            <DiscordWidget />
          </div>
          <div className="clock-col">
            <ClockWidget />
          </div>
        </div>
      </div>
      {active ? (
        <div className="character-stage-slot">
          {/* keyed so switching character remounts the stage (fresh intro line + voice) */}
          <active.Stage key={`${theme}:${active.id}`} />
          <CharacterToggle
            franchise={roster!.franchise}
            characters={characters}
            activeId={active.id}
            onSelect={selectCharacter}
          />
        </div>
      ) : (
        <>
          <h1>LIMBUS COMPANY</h1>
          <div className="sidebar-portrait-wrap">
            <div className="sidebar-portrait" />
          </div>
        </>
      )}
      <NavMenu onTabChange={onTabChange} />
    </div>
  );
}

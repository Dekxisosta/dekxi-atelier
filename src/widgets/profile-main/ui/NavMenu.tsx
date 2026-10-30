"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, LayoutGrid, Lock } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { Tab } from "@shared/config/tabs";
import { createClient } from "@shared/supabase/client";
import { useTheme, type ThemeKey } from "@shared/ui/ThemeContext";
import ReachOut from "./ReachOut";
import FavoritesModals from "./FavoritesModals";
import QuickLinks from "./QuickLinks";
import InterestsSection from "./InterestsSection";
import AboutMe from "./AboutMe";
import ProfileHeader from "./ProfileHeader";
import NavWidgetButton from "./NavWidgetButton";
import SteamWidget from "./SteamWidget";
import SpotifyWidget from "./SpotifyWidget";

type NavMenuProps = {
  onTabChange?: (tab: Tab) => void;
};

const MINOR_LINKS: { tab: Tab; label: string; sub: string }[] = [
  { tab: "gallery", label: "Gallery",    sub: "archive"   },
  { tab: "blog",    label: "Blog",       sub: "logbook"   },
];

const THEMES: { key: ThemeKey; label: string }[] = [
  { key: "azurlane", label: "Azur Lane"     },
  { key: "ishmael",  label: "Limbus Ishmael" },
];

function SteamIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <circle cx="15.5" cy="9.5" r="3" />
      <circle cx="8.5" cy="15.5" r="2" fill="currentColor" stroke="none" />
      <path d="M9.8 14 13.4 11.6" strokeLinecap="round" />
    </svg>
  );
}

function SpotifyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function TitlesIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

/**
 * Site navigation. Replaces the old top navbar: lives under the character
 * on the profile page and works in every theme.
 */
export default function NavMenu({ onTabChange }: NavMenuProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;
    supabase.auth.getUser().then(({ data }) => {
      if (!cancelled) setUser(data.user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, []);

  const go = (tab: Tab) => {
    if (onTabChange) onTabChange(tab);
    else window.location.assign(`/?tab=${tab}`);
  };

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="nav-menu" aria-label="Site navigation">
      <div className="javelin-actions">
        <button
          type="button"
          className="javelin-btn javelin-btn--formation"
          onClick={() => go("projects")}
        >
          <span className="javelin-btn-label">Projects</span>
          <span className="javelin-btn-sub">formation</span>
        </button>
        <button
          type="button"
          className="javelin-btn javelin-btn--anchor"
          onClick={() => go("commissions")}
        >
          <span className="javelin-btn-label">Commissions</span>
          <span className="javelin-btn-sub">weigh anchor</span>
        </button>
      </div>

      <div className="nav-menu-secondary">
        <NavWidgetButton
          variant="block"
          label="Profile"
          sub="introduction"
          width={360}
          className="nav-profile-btn"
        >
          <div className="nav-profile">
            <ProfileHeader />
          </div>
        </NavWidgetButton>
        {MINOR_LINKS.map((l) => (
          <button
            key={l.tab}
            type="button"
            className="javelin-btn javelin-btn--minor"
            onClick={() => go(l.tab)}
          >
            <span className="javelin-btn-label">{l.label}</span>
            <span className="javelin-btn-sub">{l.sub}</span>
          </button>
        ))}
      </div>

      <div className="nav-menu-utility">
        <div className="nav-utility-left">
          <div className="nav-theme" role="group" aria-label="Theme">
            {THEMES.map((t) => (
              <button
                key={t.key}
                type="button"
                className={"nav-theme-btn" + (theme === t.key ? " is-active" : "")}
                aria-pressed={theme === t.key}
                aria-label={t.label}
                title={t.label}
                onClick={() => setTheme(t.key)}
              >
                <span className={`nav-theme-swatch nav-theme-swatch-${t.key}`} />
              </button>
            ))}
          </div>

          <span className="nav-utility-sep" aria-hidden="true" />

          <div className="nav-widgets" role="group" aria-label="Status widgets">
            <NavWidgetButton label="Steam" icon={<SteamIcon />}>
              <SteamWidget />
            </NavWidgetButton>
            <NavWidgetButton label="Spotify" icon={<SpotifyIcon />}>
              <SpotifyWidget />
            </NavWidgetButton>
            <NavWidgetButton label="Quick links" icon={<LinkIcon />} width={340}>
              <QuickLinks />
            </NavWidgetButton>
            <NavWidgetButton label="Titles" icon={<TitlesIcon />} width={340}>
              <InterestsSection />
            </NavWidgetButton>
            <NavWidgetButton label="BYF / DNI" icon={<ShieldIcon />} width={300}>
              <AboutMe />
            </NavWidgetButton>
          </div>
        </div>

        <div className="nav-account">
          {user ? (
            <>
              <button type="button" className="nav-util-btn" onClick={() => go("dashboard")}>
                <LayoutGrid size={13} />
                <span>Dashboard</span>
              </button>
              <button type="button" className="nav-util-btn" onClick={handleLogout}>
                <LogOut size={13} />
                <span>Log out</span>
              </button>
            </>
          ) : (
            <button type="button" className="nav-util-btn" onClick={() => go("admin")}>
              <Lock size={13} />
              <span>Admin login</span>
            </button>
          )}
        </div>
      </div>

      <div className="nav-reach">
        <FavoritesModals />
        <ReachOut />
      </div>
    </nav>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Tab } from "@/lib/tabs";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

type NavTab = {
  href: string;
  tabId: Tab | "dashboard";
  label: string;
  icon: string;
  path: string;
  /** True for entries that are always a real page navigation (e.g. the
   * separate /admin/dashboard route), regardless of controlled/uncontrolled
   * tab-switching mode. */
  external?: boolean;
};

const TABS: NavTab[] = [
  { href: "/", tabId: "main", label: "Profile", icon: "person", path: "ATELIER DEKXI / ARCHIVES / FILE_NO_000" },
    { href: "/?tab=commissions", tabId: "commissions", label: "Commissions", icon: "brush", path: "ATELIER DEKXI / ARCHIVES / COMMISSION_SHEET" },
  { href: "/?tab=gallery", tabId: "gallery", label: "Art Gallery", icon: "images", path: "ATELIER DEKXI / ARCHIVES / GALLERY_ENTRIES" },
  { href: "/?tab=moots", tabId: "moots", label: "Companions", icon: "people", path: "ATELIER DEKXI / ARCHIVES / MOOTS_LOG" },
  { href: "/?tab=blog", tabId: "blog", label: "Blogs", icon: "reader", path: "ATELIER DEKXI / ARCHIVES / BLOG_ENTRIES" },
];

// Only shown in the tab row when a user is logged in — now a normal
// client-side tab switch, same as Main/Gallery/Blog/Moots.
const DASHBOARD_TAB: NavTab = {
  href: "/?tab=dashboard",
  tabId: "dashboard",
  label: "Dashboard",
  icon: "grid-outline",
  path: "ATELIER DEKXI / ADMIN / DASHBOARD",
};

// Fallback so the chip never renders blank if user_metadata.avatar_url is
// missing for some reason (e.g. provider didn't return one for this session).
const FALLBACK_AVATAR_URL = "https://avatars.githubusercontent.com/u/201718391?v=4";

type IdeHeaderProps = {
  activeTab?: Tab;
  onTabChange?: (tab: Tab) => void;
};

export default function IdeHeader({ activeTab, onTabChange }: IdeHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const controlled = activeTab !== undefined && onTabChange !== undefined;

  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // Let a normal vertical scroll/wheel gesture over the header bar scroll it
  // horizontally, since the bar itself has no vertical content to scroll.
  // Attached as a native (non-passive) listener so preventDefault works —
  // React's onWheel is passive by default and can't stop page scroll.
 useEffect(() => {
  const el = barRef.current;
  if (!el) return;

  const handleWheel = (e: WheelEvent) => {
    if (el.scrollWidth <= el.clientWidth) return;
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;

    e.preventDefault();
    el.scrollLeft += e.deltaY;
  };

  el.addEventListener("wheel", handleWheel, { passive: false });

  return () => {
    el.removeEventListener("wheel", handleWheel);
  };
}, []);


  // Only decides what to render (avatar chip vs. nothing) — actual route
  // protection still lives in middleware + the dashboard's own session check.
  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    supabase.auth.getUser().then(({ data }) => {
      if (!cancelled) setUser(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, []);

  // Close the account dropdown when clicking anywhere outside of it.
  useEffect(() => {
    if (!accountMenuOpen) return;

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest(".ide-header-account-wrap")) {
        setAccountMenuOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [accountMenuOpen]);

  // Dashboard only appears in the nav once a user is signed in.
  const visibleTabs: NavTab[] = user ? [DASHBOARD_TAB, ...TABS] : TABS;

  const active = controlled
    ? visibleTabs.find((t) => t.tabId === activeTab) ?? visibleTabs[0]
    : visibleTabs.find((t) => (t.href === "/" ? pathname === "/" : pathname.startsWith(t.href))) ?? visibleTabs[0];

  const closeMenu = () => setMenuOpen(false);

  const avatarUrl = (user?.user_metadata?.avatar_url as string | undefined) || FALLBACK_AVATAR_URL;
  const displayName =
    (user?.user_metadata?.user_name as string | undefined) ||
    (user?.user_metadata?.full_name as string | undefined) ||
    user?.email ||
    "Admin";

  async function handleLogout() {
    setAccountMenuOpen(false);
    closeMenu();
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  // Shared so the bar's tab list and the mobile dropdown's tab list
  // never drift out of sync with each other.
  const renderTab = (tab: NavTab, onClose: () => void) =>
    controlled && !tab.external ? (
      <button
        key={tab.tabId}
        type="button"
        className={"ide-header-tab" + (tab.tabId === active.tabId ? " ide-header-tab-active" : "")}
        onClick={() => {
          onTabChange!(tab.tabId as Tab);
          onClose();
        }}
      >
        <ion-icon name={tab.icon} className="ide-header-tab-icon"></ion-icon>
        <span className="ide-header-tab-label">{tab.label}</span>
      </button>
    ) : (
      <Link
        key={tab.href}
        href={tab.href}
        className={"ide-header-tab" + (tab.href === active.href ? " ide-header-tab-active" : "")}
        data-path={tab.path}
        onClick={onClose}
      >
        <ion-icon name={tab.icon} className="ide-header-tab-icon"></ion-icon>
        <span className="ide-header-tab-label">{tab.label}</span>
        <span className="ide-header-tab-route">{tab.tabId}</span>
      </Link>
    );

  const accountChip = user ? (
    <div className="ide-header-account-wrap">
      <button
        type="button"
        className="ide-header-account"
        onClick={() => setAccountMenuOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={accountMenuOpen}
        aria-label={`Account menu for ${displayName}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={avatarUrl} alt="" className="ide-header-account-avatar" />
        <span className="ide-header-account-name">{displayName}</span>
        <ion-icon
          name="chevron-down"
          className={`ide-header-account-caret${accountMenuOpen ? " is-open" : ""}`}
        ></ion-icon>
      </button>

      {accountMenuOpen && (
        <div className="ide-header-account-menu" role="menu">
          <button type="button" role="menuitem" onClick={handleLogout}>
            <ion-icon name="log-out-outline"></ion-icon>
            <span>Log out</span>
          </button>
        </div>
      )}
    </div>
  ) : controlled ? (
    <button
      type="button"
      className="ide-header-account ide-header-account-guest"
      onClick={() => {
        onTabChange!("admin");
        closeMenu();
      }}
    >
      <ion-icon name="lock-closed" className="ide-header-tab-icon"></ion-icon>
      <span className="ide-header-account-name">Admin</span>
    </button>
  ) : (
    <Link href="/?tab=admin" className="ide-header-account ide-header-account-guest" onClick={closeMenu}>
      <ion-icon name="lock-closed" className="ide-header-tab-icon"></ion-icon>
      <span className="ide-header-account-name">Admin</span>
    </Link>
  );

  return (
    <div className="ide-header-wrapper">
      <div className={`site-header-title-row ${collapsed ? "is-collapsed" : ""}`}>
        <h1 className="site-header-title">DEKXI'S ATELIER</h1>
      </div>

      <div className="ide-header-bar">
        <div className="ide-header-scroll" ref={barRef}>
          <button
            type="button"
            className={`ide-header-hamburger ${menuOpen ? "is-open" : ""}`}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Desktop / default tab row — hidden on mobile via CSS */}
          <div className="ide-header-tabs">
            {visibleTabs.map((tab) => renderTab(tab, closeMenu))}
          </div>
        </div>
        {accountChip}
      </div>

      {/* Mobile dropdown — now a child of .ide-header-wrapper (position: relative),
          so position: absolute anchors correctly under the bar. */}
      {menuOpen && (
        <div className="ide-header-mobile-menu">
          {visibleTabs.map((tab) => renderTab(tab, closeMenu))}
          {user ? (
            <>
              <div className="ide-header-tab ide-header-account-mobile" aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={avatarUrl} alt="" className="ide-header-account-avatar" />
                <span className="ide-header-tab-label">{displayName}</span>
              </div>
              <button type="button" className="ide-header-tab" onClick={handleLogout}>
                <ion-icon name="log-out-outline" className="ide-header-tab-icon"></ion-icon>
                <span className="ide-header-tab-label">Log out</span>
              </button>
            </>
          ) : controlled ? (
            <button
              type="button"
              className="ide-header-tab"
              onClick={() => {
                onTabChange!("admin");
                closeMenu();
              }}
            >
              <ion-icon name="lock-closed" className="ide-header-tab-icon"></ion-icon>
              <span className="ide-header-tab-label">Admin</span>
            </button>
          ) : (
            <Link href="/?tab=admin" className="ide-header-tab" onClick={closeMenu}>
              <ion-icon name="lock-closed" className="ide-header-tab-icon"></ion-icon>
              <span className="ide-header-tab-label">Admin</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
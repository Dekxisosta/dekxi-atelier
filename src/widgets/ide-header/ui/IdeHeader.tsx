"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Briefcase,
  Code2,
  User,
  BookOpen,
  Users,
  Paintbrush,
  Images,
  FolderOpen,
  LayoutGrid,
  Lock,
  LogOut,
  Palette,
  ChevronDown,
  Search,
  type LucideIcon,
} from "lucide-react";
import type { Tab } from "@shared/config/tabs";
import { createClient } from "@shared/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { useTheme, type ThemeKey } from "@shared/ui/ThemeContext";

// ── Types ────────────────────────────────────────────────────────────────────

type NavLeaf = {
  tabId: Tab;
  href: string;
  label: string;
  icon: LucideIcon;
};

type NavGroup = {
  key: string;
  label: string;
  icon: LucideIcon;
  children: NavLeaf[];
};

// ── Nav tree ─────────────────────────────────────────────────────────────────

/** "Work" tab → art/commissions */
const WORK_GROUP: NavGroup = {
  key: "work",
  label: "Work",
  icon: Briefcase,
  children: [
    { href: "/?tab=commissions", tabId: "commissions", label: "Commissions", icon: Paintbrush },
    { href: "/?tab=gallery",     tabId: "gallery",     label: "Art Gallery",  icon: Images     },
  ],
};

/** "About" tab → blog, moots (profile is now its own top-level tab) */
const ABOUT_GROUP: NavGroup = {
  key: "about",
  label: "About",
  icon: User,
  children: [
    { href: "/?tab=blog",   tabId: "blog",  label: "Blog",       icon: BookOpen },
    { href: "/?tab=moots",  tabId: "moots", label: "Companions", icon: Users    },
  ],
};

/** Standalone Profile tab */
const PROFILE_LEAF: NavLeaf = {
  href: "/",
  tabId: "main",
  label: "Profile",
  icon: User,
};

/** "Playground" tab → dev/projects */
const PLAYGROUND_GROUP: NavGroup = {
  key: "playground",
  label: "Playground",
  icon: Code2,
  children: [
    { href: "/?tab=projects", tabId: "projects", label: "Projects", icon: FolderOpen },
  ],
};

/** "Resource" tab → standalone (blog repurposed as resource hub) */
const RESOURCE_LEAF: NavLeaf = {
  href: "/?tab=blog",
  tabId: "blog",
  label: "Resource",
  icon: BookOpen,
};

/** All top-level groups rendered as flat pill tabs */
const TOP_GROUPS: NavGroup[] = [WORK_GROUP, ABOUT_GROUP, PLAYGROUND_GROUP];

const DASHBOARD_LEAF: NavLeaf = {
  href: "/?tab=dashboard",
  tabId: "dashboard",
  label: "Dashboard",
  icon: LayoutGrid,
};

const THEMES: { key: ThemeKey; label: string }[] = [
  { key: "amber",   label: "Limbus Amber"  },
  { key: "verdant", label: "Blind Verdant" },
];

const FALLBACK_AVATAR_URL = "https://avatars.githubusercontent.com/u/201718391?v=4";

// ── Props ────────────────────────────────────────────────────────────────────

type IdeHeaderProps = {
  activeTab?: Tab;
  onTabChange?: (tab: Tab) => void;
};

type MenuPos = { key: string; top: number; left: number };

// ── Component ────────────────────────────────────────────────────────────────

export default function IdeHeader({ activeTab, onTabChange }: IdeHeaderProps) {
  const pathname   = usePathname();
  const router     = useRouter();
  const controlled = activeTab !== undefined && onTabChange !== undefined;
  const { theme, setTheme } = useTheme();

  const [menuOpen,        setMenuOpen]        = useState(false);
  const [openGroup,       setOpenGroup]        = useState<string | null>(null);
  const [menuPos,         setMenuPos]          = useState<MenuPos | null>(null);
  const [accountMenuOpen, setAccountMenuOpen]  = useState(false);
  const [themeMenuOpen,   setThemeMenuOpen]    = useState(false);
  const [user,            setUser]             = useState<SupabaseUser | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // ── Effects ────────────────────────────────────────────────────────────────

  // Auth state
  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;
    supabase.auth.getUser().then(({ data }) => {
      if (!cancelled) setUser(data.user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => { cancelled = true; listener.subscription.unsubscribe(); };
  }, []);

  // Close group menu on outside click
  useEffect(() => {
    if (!openGroup) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest(".navbar-group-wrap") && !t.closest(".navbar-dropdown")) {
        setOpenGroup(null);
        setMenuPos(null);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [openGroup]);

  // Close group on scroll/resize
  useEffect(() => {
    if (!openGroup) return;
    const close = () => { setOpenGroup(null); setMenuPos(null); };
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, [openGroup]);

  // Close account menu on outside click
  useEffect(() => {
    if (!accountMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".navbar-account-wrap")) setAccountMenuOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [accountMenuOpen]);

  // Close theme menu on outside click
  useEffect(() => {
    if (!themeMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".navbar-theme-wrap")) setThemeMenuOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [themeMenuOpen]);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const allLeaves: NavLeaf[] = [
    ...(user ? [DASHBOARD_LEAF] : []),
    PROFILE_LEAF,
    ...TOP_GROUPS.flatMap((g) => g.children),
  ];

  /** Which leaf is currently active */
  const activeLeaf = controlled
    ? allLeaves.find((l) => l.tabId === activeTab) ?? ABOUT_GROUP.children[0]
    : allLeaves.find((l) =>
        l.href === "/" ? pathname === "/" : pathname.startsWith(l.href)
      ) ?? ABOUT_GROUP.children[0];

  const closeAll = () => { setMenuOpen(false); setOpenGroup(null); setMenuPos(null); };

  const toggleGroup = (key: string, e: React.MouseEvent<HTMLElement>) => {
    if (openGroup === key) { setOpenGroup(null); setMenuPos(null); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPos({ key, top: rect.bottom + 8, left: rect.left + rect.width / 2 });
    setOpenGroup(key);
  };

  const isGroupActive = (group: NavGroup) =>
    group.children.some((c) => c.tabId === activeLeaf.tabId);

  const avatarUrl =
    (user?.user_metadata?.avatar_url as string | undefined) || FALLBACK_AVATAR_URL;
  const displayName =
    (user?.user_metadata?.user_name as string | undefined) ||
    (user?.user_metadata?.full_name  as string | undefined) ||
    user?.email ||
    "Admin";

  async function handleLogout() {
    setAccountMenuOpen(false);
    closeAll();
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  // ── Render helpers ─────────────────────────────────────────────────────────

  /** A single leaf item inside a dropdown */
  const renderDropdownLeaf = (leaf: NavLeaf) => {
    const Icon = leaf.icon;
    const isActive = leaf.tabId === activeLeaf.tabId;
    const cls = "navbar-dropdown-item" + (isActive ? " is-active" : "");

    return controlled ? (
      <button
        key={leaf.tabId}
        type="button"
        className={cls}
        onClick={() => { onTabChange!(leaf.tabId); closeAll(); }}
      >
        <Icon size={13} className="navbar-dropdown-icon" />
        <span>{leaf.label}</span>
      </button>
    ) : (
      <Link key={leaf.href} href={leaf.href} className={cls} onClick={closeAll}>
        <Icon size={13} className="navbar-dropdown-icon" />
        <span>{leaf.label}</span>
      </Link>
    );
  };

  /** Desktop group pill button + dropdown portal */
  const renderGroupDesktop = (group: NavGroup) => {
    const GroupIcon = group.icon;
    const active    = isGroupActive(group);
    const isOpen    = openGroup === group.key;

    return (
      <div className="navbar-group-wrap" key={group.key}>
        <button
          type="button"
          className={"navbar-tab" + (active ? " is-active" : "")}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          onClick={(e) => toggleGroup(group.key, e)}
        >
          <span className="navbar-tab-label">{group.label}</span>
          <ChevronDown
            className={"navbar-tab-caret" + (isOpen ? " is-open" : "")}
            size={11}
          />
        </button>

        {isOpen && menuPos?.key === group.key && typeof document !== "undefined" &&
          createPortal(
            <div
              className="navbar-dropdown"
              role="menu"
              style={{
                position: "fixed",
                top: menuPos.top,
                left: menuPos.left,
                transform: "translateX(-50%)",
              }}
            >
              {group.children.map(renderDropdownLeaf)}
            </div>,
            document.body
          )
        }
      </div>
    );
  };

  /** Mobile accordion group */
  const renderGroupMobile = (group: NavGroup) => {
    const GroupIcon = group.icon;
    const active    = isGroupActive(group);
    const isOpen    = openGroup === group.key;

    return (
      <div className="navbar-mobile-group" key={group.key}>
        <button
          type="button"
          className={"navbar-mobile-tab" + (active ? " is-active" : "")}
          aria-expanded={isOpen}
          onClick={() => setOpenGroup(isOpen ? null : group.key)}
        >
          <GroupIcon size={15} className="navbar-mobile-tab-icon" />
          <span className="navbar-mobile-tab-label">{group.label}</span>
          <ChevronDown
            className={"navbar-tab-caret" + (isOpen ? " is-open" : "")}
            size={12}
          />
        </button>
        {isOpen && (
          <div className="navbar-mobile-children">
            {group.children.map((leaf) => {
              const LeafIcon = leaf.icon;
              const leafActive = leaf.tabId === activeLeaf.tabId;
              const cls = "navbar-mobile-child" + (leafActive ? " is-active" : "");
              return controlled ? (
                <button
                  key={leaf.tabId}
                  type="button"
                  className={cls}
                  onClick={() => { onTabChange!(leaf.tabId); closeAll(); }}
                >
                  <LeafIcon size={13} className="navbar-mobile-tab-icon" />
                  <span>{leaf.label}</span>
                </button>
              ) : (
                <Link key={leaf.href} href={leaf.href} className={cls} onClick={closeAll}>
                  <LeafIcon size={13} className="navbar-mobile-tab-icon" />
                  <span>{leaf.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // ── Theme chip ─────────────────────────────────────────────────────────────
  const themeChip = (
    <div className="navbar-theme-wrap">
      <button
        type="button"
        className="navbar-theme-btn"
        onClick={() => setThemeMenuOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={themeMenuOpen}
        aria-label="Change theme"
      >
        <Palette size={13} />
      </button>
      {themeMenuOpen && (
        <div className="navbar-theme-menu" role="menu">
          {THEMES.map((t) => (
            <button
              key={t.key}
              type="button"
              role="menuitemradio"
              aria-checked={theme === t.key}
              className={"navbar-theme-option" + (theme === t.key ? " is-active" : "")}
              onClick={() => { setTheme(t.key); setThemeMenuOpen(false); }}
            >
              <span className={`navbar-theme-swatch navbar-theme-swatch-${t.key}`} />
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // ── Account / email chip ───────────────────────────────────────────────────
  const accountChip = user ? (
    <div className="navbar-account-wrap">
      <button
        type="button"
        className="navbar-account-chip"
        onClick={() => setAccountMenuOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={accountMenuOpen}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={avatarUrl} alt="" className="navbar-account-avatar" />
        <span className="navbar-account-name">{displayName}</span>
        <ChevronDown
          className={"navbar-tab-caret" + (accountMenuOpen ? " is-open" : "")}
          size={11}
        />
      </button>
      {accountMenuOpen && (
        <div className="navbar-account-menu" role="menu">
          {themeChip}
          <button type="button" role="menuitem" className="navbar-account-menu-item" onClick={handleLogout}>
            <LogOut size={14} />
            <span>Log out</span>
          </button>
        </div>
      )}
    </div>
  ) : controlled ? (
    <button
      type="button"
      className="navbar-cta"
      onClick={() => { onTabChange!("admin"); closeAll(); }}
    >
      Admin login
    </button>
  ) : (
    <Link href="/?tab=admin" className="navbar-cta" onClick={closeAll}>
      Admin login
    </Link>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <nav className="navbar-wrapper" aria-label="Site navigation">
      <div className="navbar-pill" ref={barRef}>

        {/* ── Desktop tabs ── */}
        <div className="navbar-tabs">
          {user && (
            controlled ? (
              <button
                type="button"
                className={"navbar-tab" + (activeLeaf.tabId === "dashboard" ? " is-active" : "")}
                onClick={() => { onTabChange!(DASHBOARD_LEAF.tabId); closeAll(); }}
              >
                <span className="navbar-tab-label">{DASHBOARD_LEAF.label}</span>
              </button>
            ) : (
              <Link
                href={DASHBOARD_LEAF.href}
                className={"navbar-tab" + (activeLeaf.tabId === "dashboard" ? " is-active" : "")}
              >
                <span className="navbar-tab-label">{DASHBOARD_LEAF.label}</span>
              </Link>
            )
          )}
          {/* Standalone Profile tab */}
          {controlled ? (
            <button
              type="button"
              className={"navbar-tab" + (activeLeaf.tabId === "main" ? " is-active" : "")}
              onClick={() => { onTabChange!(PROFILE_LEAF.tabId); closeAll(); }}
            >
              <span className="navbar-tab-label">{PROFILE_LEAF.label}</span>
            </button>
          ) : (
            <Link
              href={PROFILE_LEAF.href}
              className={"navbar-tab" + (activeLeaf.tabId === "main" ? " is-active" : "")}
            >
              <span className="navbar-tab-label">{PROFILE_LEAF.label}</span>
            </Link>
          )}
          {TOP_GROUPS.map(renderGroupDesktop)}
        </div>

        {/* ── Search / auth cluster ── */}
        <div className="navbar-right">
          <button type="button" className="navbar-search-btn" aria-label="Search">
            <Search size={16} />
          </button>

          {!user && (
            controlled ? (
              <button
                type="button"
                className="navbar-signin"
                onClick={() => { onTabChange!("admin"); closeAll(); }}
              >
                Sign in
              </button>
            ) : (
              <Link href="/?tab=admin" className="navbar-signin" onClick={closeAll}>
                Sign in
              </Link>
            )
          )}

          {accountChip}
        </div>

        {/* ── Hamburger (mobile) ── */}
        <button
          type="button"
          className={"navbar-hamburger" + (menuOpen ? " is-open" : "")}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div className="navbar-mobile-menu">
          {user && (
            controlled ? (
              <button
                type="button"
                className={"navbar-mobile-tab" + (activeLeaf.tabId === "dashboard" ? " is-active" : "")}
                onClick={() => { onTabChange!(DASHBOARD_LEAF.tabId); closeAll(); }}
              >
                <LayoutGrid size={15} className="navbar-mobile-tab-icon" />
                <span className="navbar-mobile-tab-label">{DASHBOARD_LEAF.label}</span>
              </button>
            ) : (
              <Link
                href={DASHBOARD_LEAF.href}
                className={"navbar-mobile-tab" + (activeLeaf.tabId === "dashboard" ? " is-active" : "")}
                onClick={closeAll}
              >
                <LayoutGrid size={15} className="navbar-mobile-tab-icon" />
                <span className="navbar-mobile-tab-label">{DASHBOARD_LEAF.label}</span>
              </Link>
            )
          )}
          {TOP_GROUPS.map(renderGroupMobile)}

          {/* Standalone Profile tab */}
          {controlled ? (
            <button
              type="button"
              className={"navbar-mobile-tab" + (activeLeaf.tabId === "main" ? " is-active" : "")}
              onClick={() => { onTabChange!(PROFILE_LEAF.tabId); closeAll(); }}
            >
              <User size={15} className="navbar-mobile-tab-icon" />
              <span className="navbar-mobile-tab-label">{PROFILE_LEAF.label}</span>
            </button>
          ) : (
            <Link
              href={PROFILE_LEAF.href}
              className={"navbar-mobile-tab" + (activeLeaf.tabId === "main" ? " is-active" : "")}
              onClick={closeAll}
            >
              <User size={15} className="navbar-mobile-tab-icon" />
              <span className="navbar-mobile-tab-label">{PROFILE_LEAF.label}</span>
            </Link>
          )}

          <div className="navbar-mobile-footer">
            {/* Theme swatches */}
            <div className="navbar-mobile-theme-row">
              {THEMES.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  className={"navbar-mobile-theme-btn" + (theme === t.key ? " is-active" : "")}
                  onClick={() => setTheme(t.key)}
                >
                  <span className={`navbar-theme-swatch navbar-theme-swatch-${t.key}`} />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {/* Auth */}
            {user ? (
              <button type="button" className="navbar-mobile-tab" onClick={handleLogout}>
                <LogOut size={15} className="navbar-mobile-tab-icon" />
                <span className="navbar-mobile-tab-label">Log out</span>
              </button>
            ) : controlled ? (
              <button type="button" className="navbar-mobile-tab" onClick={() => { onTabChange!("admin"); closeAll(); }}>
                <Lock size={15} className="navbar-mobile-tab-icon" />
                <span className="navbar-mobile-tab-label">Admin login</span>
              </button>
            ) : (
              <Link href="/?tab=admin" className="navbar-mobile-tab" onClick={closeAll}>
                <Lock size={15} className="navbar-mobile-tab-icon" />
                <span className="navbar-mobile-tab-label">Admin login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  Briefcase,
  Code2,
  LayoutGrid,
  ChevronDown,
  Paintbrush,
  Images,
  MessageSquare,
  Layers,
  FolderOpen,
  Award,
  Building2,
  BookOpen,
  Users,
  Lock,
  LogOut,
  Palette,
  type LucideIcon,
} from "lucide-react";
import type { Tab } from "@/lib/tabs";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { useTheme, type ThemeKey } from "@/contexts/ThemeContext";

type NavLeaf = {
  tabId: Tab;
  href: string;
  label: string;
  icon: LucideIcon;
  path: string;
  disabled?: boolean;
};

type NavGroup = {
  key: string;
  label: string;
  icon: LucideIcon;
  children: NavLeaf[];
};

const PROFILE_MAIN: NavLeaf = {
  href: "/",
  tabId: "main",
  label: "Profile",
  icon: User,
  path: "ATELIER DEKXI / ARCHIVES / FILE_NO_000",
};

const PROFILE_GROUP: NavGroup = {
  key: "profile",
  label: "Profile",
  icon: User,
  children: [
    { href: "/?tab=blog", tabId: "blog", label: "Blogs", icon: BookOpen, path: "ATELIER DEKXI / ARCHIVES / BLOG_ENTRIES" },
    { href: "/?tab=moots", tabId: "moots", label: "Companions", icon: Users, path: "ATELIER DEKXI / ARCHIVES / MOOTS_LOG" },
  ],
};

const WORK_GROUP: NavGroup = {
  key: "work",
  label: "Art",
  icon: Briefcase,
  children: [
    { href: "/?tab=commissions", tabId: "commissions", label: "Commissions", icon: Paintbrush, path: "ATELIER DEKXI / ARCHIVES / COMMISSION_SHEET" },
    { href: "/?tab=gallery", tabId: "gallery", label: "Art Gallery", icon: Images, path: "ATELIER DEKXI / ARCHIVES / GALLERY_ENTRIES" },
    { href: "/?tab=testimonials", tabId: "testimonials", label: "Testimonials", icon: MessageSquare, path: "ATELIER DEKXI / ARCHIVES / TESTIMONIALS_LOG", disabled: true },
  ],
};

const DEV_GROUP: NavGroup = {
  key: "dev",
  label: "Dev",
  icon: Code2,
  children: [
    { href: "/?tab=techstack", tabId: "techstack", label: "Tech Stack & Roadmap", icon: Layers, path: "ATELIER DEKXI / DEV / STACK_AND_ROADMAP", disabled: true },
    { href: "/?tab=projects", tabId: "projects", label: "Projects", icon: FolderOpen, path: "ATELIER DEKXI / DEV / PROJECTS", disabled: true },
    { href: "/?tab=certificates", tabId: "certificates", label: "Certificates & Achievements", icon: Award, path: "ATELIER DEKXI / DEV / CERTS_AND_ACHIEVEMENTS", disabled: true },
    { href: "/?tab=affiliations", tabId: "affiliations", label: "Affiliations", icon: Building2, path: "ATELIER DEKXI / DEV / AFFILIATIONS", disabled: true },
  ],
};

const TOGGLE_GROUPS: NavGroup[] = [WORK_GROUP, DEV_GROUP];

const DASHBOARD_LEAF: NavLeaf = {
  href: "/?tab=dashboard",
  tabId: "dashboard",
  label: "Dashboard",
  icon: LayoutGrid,
  path: "ATELIER DEKXI / ADMIN / DASHBOARD",
};

const THEMES: { key: ThemeKey; label: string }[] = [
  { key: "amber", label: "Limbus Amber" },
  { key: "verdant", label: "Blind Verdant" },
];

const FALLBACK_AVATAR_URL = "https://avatars.githubusercontent.com/u/201718391?v=4";

type IdeHeaderProps = {
  activeTab?: Tab;
  onTabChange?: (tab: Tab) => void;
};

type MenuPos = { key: string; top: number; left: number };

export default function IdeHeader({ activeTab, onTabChange }: IdeHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const controlled = activeTab !== undefined && onTabChange !== undefined;
  const { theme, setTheme } = useTheme();

  const [collapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState<MenuPos | null>(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

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
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

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

  useEffect(() => {
    if (!accountMenuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest(".ide-header-account-wrap")) setAccountMenuOpen(false);
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [accountMenuOpen]);

  useEffect(() => {
    if (!themeMenuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest(".ide-header-theme-wrap")) setThemeMenuOpen(false);
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [themeMenuOpen]);

  useEffect(() => {
    if (!openGroup) return;
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest(".ide-header-group-wrap") && !target.closest(".ide-header-group-menu")) {
        setOpenGroup(null);
        setMenuPos(null);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openGroup]);

  useEffect(() => {
    const el = barRef.current;
    if (!el || !openGroup) return;
    const close = () => {
      setOpenGroup(null);
      setMenuPos(null);
    };
    el.addEventListener("scroll", close);
    window.addEventListener("resize", close);
    return () => {
      el.removeEventListener("scroll", close);
      window.removeEventListener("resize", close);
    };
  }, [openGroup]);

  const dashboardLeaves: NavLeaf[] = user ? [DASHBOARD_LEAF] : [];
  const allLeaves: NavLeaf[] = [
    ...dashboardLeaves,
    PROFILE_MAIN,
    ...PROFILE_GROUP.children,
    ...TOGGLE_GROUPS.flatMap((g) => g.children),
  ].filter((leaf) => !leaf.disabled);

  const active = controlled
    ? allLeaves.find((t) => t.tabId === activeTab) ?? PROFILE_MAIN
    : allLeaves.find((t) => (t.href === "/" ? pathname === "/" : pathname.startsWith(t.href))) ?? PROFILE_MAIN;

  const closeAll = () => {
    setMenuOpen(false);
    setOpenGroup(null);
    setMenuPos(null);
  };

  const toggleGroup = (key: string, e: React.MouseEvent<HTMLElement>) => {
    if (openGroup === key) {
      setOpenGroup(null);
      setMenuPos(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPos({ key, top: rect.bottom + 4, left: rect.left });
    setOpenGroup(key);
  };

  const avatarUrl = (user?.user_metadata?.avatar_url as string | undefined) || FALLBACK_AVATAR_URL;
  const displayName =
    (user?.user_metadata?.user_name as string | undefined) ||
    (user?.user_metadata?.full_name as string | undefined) ||
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

  const renderLeaf = (leaf: NavLeaf, onClose: () => void) => {
    const Icon = leaf.icon;

    if (leaf.disabled) {
      return (
        <span
          key={leaf.tabId}
          className="ide-header-tab ide-header-tab-disabled"
          aria-disabled="true"
          title="Coming soon"
        >
          <Icon className="ide-header-tab-icon" size={13} />
          <span className="ide-header-tab-label">{leaf.label}</span>
          <span className="ide-header-tab-soon">soon</span>
        </span>
      );
    }
    return controlled ? (
      <button
        key={leaf.tabId}
        type="button"
        className={"ide-header-tab" + (leaf.tabId === active.tabId ? " ide-header-tab-active" : "")}
        onClick={() => {
          onTabChange!(leaf.tabId);
          onClose();
        }}
      >
        <Icon className="ide-header-tab-icon" size={13} />
        <span className="ide-header-tab-label">{leaf.label}</span>
      </button>
    ) : (
      <Link
        key={leaf.href}
        href={leaf.href}
        className={"ide-header-tab" + (leaf.href === active.href ? " ide-header-tab-active" : "")}
        data-path={leaf.path}
        onClick={onClose}
      >
        <Icon className="ide-header-tab-icon" size={13} />
        <span className="ide-header-tab-label">{leaf.label}</span>
        <span className="ide-header-tab-route">{leaf.tabId}</span>
      </Link>
    );
  };

  const renderGroupMenu = (group: NavGroup) => {
    if (openGroup !== group.key || menuPos?.key !== group.key) return null;
    if (typeof document === "undefined") return null;

    return createPortal(
      <div
        className="ide-header-group-menu"
        style={{ position: "fixed", top: menuPos.top, left: menuPos.left }}
        role="menu"
      >
        {group.children.map((leaf) =>
          renderLeaf(leaf, () => {
            setOpenGroup(null);
            setMenuPos(null);
          })
        )}
      </div>,
      document.body
    );
  };

  const renderToggleGroupDesktop = (group: NavGroup) => {
    const isActive = group.children.some((c) => c.tabId === active.tabId);
    const isOpen = openGroup === group.key;
    const GroupIcon = group.icon;

    return (
      <div className="ide-header-group-wrap" key={group.key}>
        <button
          type="button"
          className={"ide-header-tab" + (isActive ? " ide-header-tab-active" : "")}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          onClick={(e) => toggleGroup(group.key, e)}
        >
          <GroupIcon className="ide-header-tab-icon" size={13} />
          <span className="ide-header-tab-label">{group.label}</span>
          <ChevronDown
            className={`ide-header-group-caret${isOpen ? " is-open" : ""}`}
            size={11}
          />
        </button>
        {renderGroupMenu(group)}
      </div>
    );
  };

  const renderToggleGroupMobile = (group: NavGroup) => {
    const isActive = group.children.some((c) => c.tabId === active.tabId);
    const isOpen = openGroup === group.key;
    const GroupIcon = group.icon;

    return (
      <div className="ide-header-mobile-group" key={group.key}>
        <button
          type="button"
          className={"ide-header-tab" + (isActive ? " ide-header-tab-active" : "")}
          aria-expanded={isOpen}
          onClick={() => setOpenGroup(isOpen ? null : group.key)}
        >
          <GroupIcon className="ide-header-tab-icon" size={13} />
          <span className="ide-header-tab-label">{group.label}</span>
          <ChevronDown
            className={`ide-header-group-caret${isOpen ? " is-open" : ""}`}
            size={11}
          />
        </button>

        {isOpen && (
          <div className="ide-header-mobile-group-children">
            {group.children.map((leaf) => renderLeaf(leaf, closeAll))}
          </div>
        )}
      </div>
    );
  };

  const renderProfileGroupDesktop = () => {
    const isOpen = openGroup === PROFILE_GROUP.key;
    const mainIsActive = active.tabId === "main";
    const ProfileIcon = PROFILE_MAIN.icon;

    const mainButton = controlled ? (
      <button
        type="button"
        className={"ide-header-tab ide-header-profile-main" + (mainIsActive ? " ide-header-tab-active" : "")}
        onClick={() => {
          onTabChange!("main");
          setOpenGroup(null);
          setMenuPos(null);
        }}
      >
        <ProfileIcon className="ide-header-tab-icon" size={13} />
        <span className="ide-header-tab-label">{PROFILE_MAIN.label}</span>
      </button>
    ) : (
      <Link
        href={PROFILE_MAIN.href}
        className={"ide-header-tab ide-header-profile-main" + (mainIsActive ? " ide-header-tab-active" : "")}
        data-path={PROFILE_MAIN.path}
        onClick={() => {
          setOpenGroup(null);
          setMenuPos(null);
        }}
      >
        <ProfileIcon className="ide-header-tab-icon" size={13} />
        <span className="ide-header-tab-label">{PROFILE_MAIN.label}</span>
      </Link>
    );

    return (
      <div className="ide-header-group-wrap ide-header-profile-group" key="profile">
        {mainButton}
        <button
          type="button"
          className="ide-header-group-caret-btn"
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-label="Toggle profile submenu"
          onClick={(e) => toggleGroup(PROFILE_GROUP.key, e)}
        >
          <ChevronDown
            className={`ide-header-group-caret${isOpen ? " is-open" : ""}`}
            size={11}
          />
        </button>
        {renderGroupMenu(PROFILE_GROUP)}
      </div>
    );
  };

  const renderProfileGroupMobile = () => {
    const isOpen = openGroup === PROFILE_GROUP.key;
    const mainIsActive = active.tabId === "main";
    const ProfileIcon = PROFILE_MAIN.icon;

    const mainButton = controlled ? (
      <button
        type="button"
        className={"ide-header-tab ide-header-profile-main" + (mainIsActive ? " ide-header-tab-active" : "")}
        onClick={() => {
          onTabChange!("main");
          closeAll();
        }}
      >
        <ProfileIcon className="ide-header-tab-icon" size={13} />
        <span className="ide-header-tab-label">{PROFILE_MAIN.label}</span>
      </button>
    ) : (
      <Link
        href={PROFILE_MAIN.href}
        className={"ide-header-tab ide-header-profile-main" + (mainIsActive ? " ide-header-tab-active" : "")}
        data-path={PROFILE_MAIN.path}
        onClick={closeAll}
      >
        <ProfileIcon className="ide-header-tab-icon" size={13} />
        <span className="ide-header-tab-label">{PROFILE_MAIN.label}</span>
      </Link>
    );

    return (
      <div className="ide-header-mobile-group" key="profile">
        <div className="ide-header-mobile-profile-row">
          {mainButton}
          <button
            type="button"
            className="ide-header-group-caret-btn"
            aria-expanded={isOpen}
            aria-label="Toggle profile submenu"
            onClick={() => setOpenGroup(isOpen ? null : PROFILE_GROUP.key)}
          >
            <ChevronDown
              className={`ide-header-group-caret${isOpen ? " is-open" : ""}`}
              size={11}
            />
          </button>
        </div>

        {isOpen && (
          <div className="ide-header-mobile-group-children">
            {PROFILE_GROUP.children.map((leaf) => renderLeaf(leaf, closeAll))}
          </div>
        )}
      </div>
    );
  };

  const themeChip = (
    <div className="ide-header-theme-wrap">
      <button
        type="button"
        className="ide-header-theme-btn"
        onClick={() => setThemeMenuOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={themeMenuOpen}
        aria-label="Change theme"
        title="Change theme"
      >
        <Palette size={14} />
        <ChevronDown
          className={`ide-header-group-caret${themeMenuOpen ? " is-open" : ""}`}
          size={11}
        />
      </button>

      {themeMenuOpen && (
        <div className="ide-header-theme-menu" role="menu">
          {THEMES.map((t) => (
            <button
              key={t.key}
              type="button"
              role="menuitemradio"
              aria-checked={theme === t.key}
              className={"ide-header-theme-option" + (theme === t.key ? " is-active" : "")}
              onClick={() => {
                setTheme(t.key);
                setThemeMenuOpen(false);
              }}
            >
              <span className={`ide-header-theme-swatch ide-header-theme-swatch-${t.key}`} />
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
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
        <ChevronDown
          className={`ide-header-account-caret${accountMenuOpen ? " is-open" : ""}`}
          size={12}
        />
      </button>

      {accountMenuOpen && (
        <div className="ide-header-account-menu" role="menu">
          <button type="button" role="menuitem" onClick={handleLogout}>
            <LogOut size={16} />
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
        closeAll();
      }}
    >
      <Lock className="ide-header-tab-icon" size={13} />
      <span className="ide-header-account-name">Admin</span>
    </button>
  ) : (
    <Link href="/?tab=admin" className="ide-header-account ide-header-account-guest" onClick={closeAll}>
      <Lock className="ide-header-tab-icon" size={13} />
      <span className="ide-header-account-name">Admin</span>
    </Link>
  );

  return (
    <div className="ide-header-wrapper">
      <div className={`site-header-title-row ${collapsed ? "is-collapsed" : ""}`}>
        <h1 className="site-header-title">DEKXI&apos;S ATELIER</h1>
        <div className="ide-header-title-actions">
          {themeChip}
          {accountChip}
        </div>
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

          <div className="ide-header-tabs">
            {user && renderLeaf(DASHBOARD_LEAF, closeAll)}
            {renderProfileGroupDesktop()}
            {TOGGLE_GROUPS.map(renderToggleGroupDesktop)}
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="ide-header-mobile-menu">

          {user && renderLeaf(DASHBOARD_LEAF, closeAll)}
          {renderProfileGroupMobile()}
          {TOGGLE_GROUPS.map(renderToggleGroupMobile)}

          {user ? (
            <>
              <div className="ide-header-tab ide-header-account-mobile" aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={avatarUrl} alt="" className="ide-header-account-avatar" />
                <span className="ide-header-tab-label">{displayName}</span>
              </div>
              <button type="button" className="ide-header-tab" onClick={handleLogout}>
                <LogOut className="ide-header-tab-icon" size={13} />
                <span className="ide-header-tab-label">Log out</span>
              </button>
            </>
          ) : controlled ? (
            <button
              type="button"
              className="ide-header-tab"
              onClick={() => {
                onTabChange!("admin");
                closeAll();
              }}
            >
              <Lock className="ide-header-tab-icon" size={13} />
              <span className="ide-header-tab-label">Admin</span>
            </button>
          ) : (
            <Link href="/?tab=admin" className="ide-header-tab" onClick={closeAll}>
              <Lock className="ide-header-tab-icon" size={13} />
              <span className="ide-header-tab-label">Admin</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
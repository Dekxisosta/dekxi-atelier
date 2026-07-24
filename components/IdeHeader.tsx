"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Tab } from "@/lib/tabs";

const TABS: { href: string; tabId: Tab; label: string; icon: string; path: string }[] = [
  { href: "/", tabId: "main", label: "Profile", icon: "person", path: "ATELIER DEKXI / ARCHIVES / FILE_NO_000" },
  { href: "/?tab=gallery", tabId: "gallery", label: "Art Gallery", icon: "images", path: "ATELIER DEKXI / ARCHIVES / GALLERY_ENTRIES" },
  { href: "/?tab=moots", tabId: "moots", label: "Companions", icon: "people", path: "ATELIER DEKXI / ARCHIVES / MOOTS_LOG" },
  { href: "/?tab=blog", tabId: "blog", label: "Blogs", icon: "reader", path: "ATELIER DEKXI / ARCHIVES / BLOG_ENTRIES" },
  { href: "/?tab=admin", tabId: "admin", label: "Admin", icon: "lock-closed", path: "ATELIER DEKXI / ARCHIVES / RESTRICTED" }
];

type IdeHeaderProps = {
  activeTab?: Tab;
  onTabChange?: (tab: Tab) => void;
};

export default function IdeHeader({ activeTab, onTabChange }: IdeHeaderProps) {
  const pathname = usePathname();
  const controlled = activeTab !== undefined && onTabChange !== undefined;

  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setCollapsed(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const active = controlled
    ? TABS.find((t) => t.tabId === activeTab) ?? TABS[0]
    : TABS.find((t) => (t.href === "/" ? pathname === "/" : pathname.startsWith(t.href))) ?? TABS[0];

  const closeMenu = () => setMenuOpen(false);

  // Shared so the bar's tab list and the mobile dropdown's tab list
  // never drift out of sync with each other.
  const renderTab = (tab: (typeof TABS)[number], onClose: () => void) =>
    controlled ? (
      <button
        key={tab.tabId}
        type="button"
        className={"ide-header-tab" + (tab.tabId === active.tabId ? " ide-header-tab-active" : "")}
        onClick={() => {
          onTabChange!(tab.tabId);
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

  return (
    <div className="ide-header-wrapper">
      <div className={`site-header-title-row ${collapsed ? "is-collapsed" : ""}`}>
        <h1 className="site-header-title">DEKXI'S ATELIER</h1>
      </div>

      <div className="ide-header-bar">
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
          {TABS.map((tab) => renderTab(tab, closeMenu))}
        </div>

        <div className="ide-header-right">
          <div className="ide-header-path">{active.path}</div>
          <div className="ide-header-controls">
            <span className="ide-dot ide-dot-red"></span>
            <span className="ide-dot ide-dot-yellow"></span>
            <span className="ide-dot ide-dot-green"></span>
          </div>
        </div>
      </div>

      {/* Mobile dropdown — now a child of .ide-header-wrapper (position: relative),
          so position: absolute anchors correctly under the bar. */}
      {menuOpen && (
        <div className="ide-header-mobile-menu">
          {TABS.map((tab) => renderTab(tab, closeMenu))}
        </div>
      )}
    </div>
  );
}
"use client";

import { useCallback, useState } from "react";
import Main from "./components/Main";
import Blog from "./components/Blog";
import Moots from "./components/Moots";
import AdminLogin from "./components/AdminLogin";
import type { Friend, BlogPost } from "./page";
import { TAB_META, type Tab } from "./tabs";

type HomeClientProps = {
  friends: Friend[];
  posts: BlogPost[];
  initialTab: Tab;
};

export default function HomeClient({ friends, posts, initialTab }: HomeClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  const selectTab = useCallback((tab: Tab) => {
    setActiveTab(tab);

    // Sync the URL so refresh/share/bookmark land back on this tab —
    // without router.push, which would trigger a real Next.js
    // navigation (and re-run the Server Component's data fetch).
    // replaceState is a plain browser API: it updates the address bar
    // and nothing else, so this stays instantaneous.
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState(null, "", url);
  }, []);

  return (
    <div className="container-page">
      <div className="bg-decor"></div>
      <div className="container-main-decor-fur">
        <div className="container-main-decor">
          <div className="ide-header-bar">
            <div className="ide-header-controls">
              <span className="ide-dot ide-dot-red"></span>
              <span className="ide-dot ide-dot-yellow"></span>
              <span className="ide-dot ide-dot-green"></span>
            </div>

            <div className="ide-header-tabs">
              {TAB_META.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={
                    "ide-header-tab" + (activeTab === tab.id ? " ide-header-tab-active" : "")
                  }
                  onClick={() => selectTab(tab.id)}
                >
                  <ion-icon name={tab.icon} className="ide-header-tab-icon"></ion-icon>
                  <span className="ide-header-tab-label">{tab.label}</span>
                </button>
              ))}
            </div>

            <span className="ide-header-path">
              {TAB_META.find((t) => t.id === activeTab)?.path}
            </span>
          </div>

          {/*
            All four views render every time — only `display` toggles.
            This keeps each one mounted across tab switches, so scroll
            position, form inputs, and any loaded state survive instead
            of resetting on every click.
          */}
          <div style={{ display: activeTab === "main" ? "block" : "none" }}>
            <Main />
          </div>
          <div style={{ display: activeTab === "blog" ? "block" : "none" }}>
            <Blog posts={posts} />
          </div>
          <div style={{ display: activeTab === "moots" ? "block" : "none" }}>
            <Moots friends={friends} />
          </div>
          <div style={{ display: activeTab === "admin" ? "block" : "none" }}>
            <AdminLogin />
          </div>
        </div>
      </div>
    </div>
  );
}
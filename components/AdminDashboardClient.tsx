"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Tab } from "@/lib/tabs";
import FriendsTab from "./admin-moots/FriendsTab";
import BlogTab from "./admin-blog/BlogTab";
import GalleryTab from "./admin-gallery/GalleryTab";

type DashboardSubTab = "friends" | "blog" | "gallery";

type DashboardProps = {
  /** Switches HomeClient's activeTab — used for "Back to Site" and after logout.
   * Kept generic (any Tab) rather than a single onRequireLogin callback so this
   * component can also send the user back to "main" on demand. */
  onNavigateTab: (tab: Tab) => void;
};

export default function Dashboard({ onNavigateTab }: DashboardProps) {
  const [user, setUser] = useState<User | null | undefined>(undefined); // undefined = still checking
  const [subTab, setSubTab] = useState<DashboardSubTab>("friends");

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    supabase.auth.getUser().then(({ data }) => {
      if (cancelled) return;
      setUser(data.user);
      if (!data.user) onNavigateTab("admin");
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      setUser(session?.user ?? null);
      if (!session?.user) onNavigateTab("admin");
    });

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, [onNavigateTab]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    onNavigateTab("admin");
  }

  // Still resolving the session — render nothing rather than flash content.
  if (user === undefined) {
    return <div className="admin-wrap admin-loading">Checking session…</div>;
  }

  // Logged out — onNavigateTab("admin") above already redirected the tab;
  // render nothing here as a safety net in case the parent hasn't re-rendered yet.
  if (!user) {
    return null;
  }

  return (
    <div className="admin-wrap">
      <div className="admin-topbar">
        <span className="admin-topbar-title">L-CORP // ADMIN DASHBOARD</span>
      </div>

      <div className="admin-tabs">
        <button
          className={"admin-tab" + (subTab === "friends" ? " admin-tab-active" : "")}
          onClick={() => setSubTab("friends")}
        >
          Friends
        </button>
        <button
          className={"admin-tab" + (subTab === "blog" ? " admin-tab-active" : "")}
          onClick={() => setSubTab("blog")}
        >
          Blog Posts
        </button>
        <button
          className={"admin-tab" + (subTab === "gallery" ? " admin-tab-active" : "")}
          onClick={() => setSubTab("gallery")}
        >
          Art Gallery
        </button>
      </div>

      {subTab === "friends" && <FriendsTab />}
      {subTab === "blog" && <BlogTab />}
      {subTab === "gallery" && <GalleryTab />}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Tab } from "@/lib/tabs";
import FriendsTab from "./admin-moots/FriendsTab";
import BlogTab from "./admin-blog/BlogTab";
import GalleryTab from "./admin-gallery/GalleryTab";

type DashboardSubTab = "friends" | "blog" | "gallery";

type DashboardProps = {onNavigateTab: (tab: Tab) => void; isActive: boolean;};

export default function Dashboard({ onNavigateTab, isActive }: DashboardProps) {
  const [user, setUser] = useState<User | null | undefined>(undefined); // undefined = still checking
  const [subTab, setSubTab] = useState<DashboardSubTab>("friends");

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    supabase.auth.getUser().then(({ data }) => {
      if (cancelled) return;
      setUser(data.user);
      // Only steal the active tab if Dashboard is actually the visible tab
      // right now — see isActive doc comment above.
      if (!data.user && isActive) onNavigateTab("admin");
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      setUser(session?.user ?? null);
      if (!session?.user && isActive) onNavigateTab("admin");
    });

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, [onNavigateTab, isActive]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    onNavigateTab("admin");
  }

  // Still resolving the session — render nothing rather than flash content.
  if (user === undefined) {
    return <div className="admin-wrap admin-loading">Checking session…</div>;
  }

  // Logged out — onNavigateTab("admin") above already redirected the tab
  // (when isActive), or this instance simply isn't visible right now;
  // render nothing here as a safety net either way.
  if (!user) {
    return null;
  }

  return (
    <div className="admin-wrap">
      <div className="admin-topbar">
        <span className="admin-topbar-title">L-CORP // ADMIN DASHBOARD</span>
        <button className="admin-topbar-logout" onClick={handleLogout}>
          Log out
        </button>
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
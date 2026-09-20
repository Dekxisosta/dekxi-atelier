"use client";

import { useEffect, useState } from "react";
import { createClient } from "@shared/supabase/client";
import type { Tab } from "@shared/config/tabs";
import type { User } from "@supabase/supabase-js";
import { FriendsTab } from "@features/admin-moots";
import { BlogTab } from "@features/admin-blog";
import { AdminGalleryTab } from "@features/admin-gallery";

type DashboardSubTab = "friends" | "blog" | "gallery";

type Props = {
  onNavigateTab: (tab: Tab) => void;
  isActive: boolean;
};

export default function AdminDashboard({ onNavigateTab, isActive }: Props) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [subTab, setSubTab] = useState<DashboardSubTab>("friends");

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    supabase.auth.getUser().then(({ data }) => {
      if (cancelled) return;
      setUser(data.user);
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

  if (user === undefined) {
    return <div className="admin-wrap admin-loading">Checking session…</div>;
  }

  if (!user) return null;

  return (
    <div className="admin-wrap">
      <div className="admin-topbar">
        <span className="admin-topbar-title">L-CORP // ADMIN DASHBOARD</span>
        <button className="admin-topbar-logout" onClick={handleLogout}>
          Log out
        </button>
      </div>

      <div className="admin-tabs">
        {(["friends", "blog", "gallery"] as DashboardSubTab[]).map((t) => (
          <button
            key={t}
            className={"admin-tab" + (subTab === t ? " admin-tab-active" : "")}
            onClick={() => setSubTab(t)}
          >
            {t === "friends" ? "Friends" : t === "blog" ? "Blog Posts" : "Art Gallery"}
          </button>
        ))}
      </div>

      {subTab === "friends"  && <FriendsTab />}
      {subTab === "blog"     && <BlogTab />}
      {subTab === "gallery"  && <AdminGalleryTab />}
    </div>
  );
}

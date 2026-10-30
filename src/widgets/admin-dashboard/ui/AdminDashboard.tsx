"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createClient } from "@shared/supabase/client";
import type { Tab } from "@shared/config/tabs";
import type { User } from "@supabase/supabase-js";
import { FriendsTab } from "@features/admin-moots";
import { BlogTab } from "@features/admin-blog";
import { AdminGalleryTab } from "@features/admin-gallery";

type DashboardSubTab = "friends" | "blog" | "gallery";

const SUB_TABS: { id: DashboardSubTab; label: string; hint: string; icon: ReactNode }[] = [
  {
    id: "friends",
    label: "Friends",
    hint: "Manage the moots list",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="8" r="3.2" />
        <path d="M2.8 19c.5-3.2 3-5 6.2-5s5.7 1.8 6.2 5" />
        <path d="M16 5.2a3 3 0 0 1 0 5.6M18 14.3c1.8.6 3 2.3 3.2 4.7" />
      </svg>
    ),
  },
  {
    id: "blog",
    label: "Blog Posts",
    hint: "Write and edit posts",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 3.5h10l4 4V20.5H5z" />
        <path d="M14.5 3.5v4.5H19M8.5 12h7M8.5 15.5h7" />
      </svg>
    ),
  },
  {
    id: "gallery",
    label: "Art Gallery",
    hint: "Upload and organise art",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
        <circle cx="9" cy="10" r="1.6" />
        <path d="m4 17 5-4.5 3.5 3 3-2.5 4.5 4" />
      </svg>
    ),
  },
];

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

  if (user === undefined) {
    return <div className="admin-wrap admin-loading">Checking session…</div>;
  }

  if (!user) return null;

  return (
    <div className="admin-wrap">
      <nav className="admin-tabs-bar" aria-label="Dashboard sections">
        <div className="admin-tabs" role="tablist">
          {SUB_TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={subTab === t.id}
              className={"admin-tab" + (subTab === t.id ? " admin-tab-active" : "")}
              onClick={() => setSubTab(t.id)}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="admin-panel-body" key={subTab}>
        {subTab === "friends" && <FriendsTab />}
        {subTab === "blog" && <BlogTab />}
        {subTab === "gallery" && <AdminGalleryTab />}
      </div>
    </div>
  );
}

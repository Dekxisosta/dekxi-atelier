"use client";

import { useCallback, useEffect, useState } from "react";
import { ProfileMainView } from "@widgets/profile-main";
import { GalleryViewer } from "@widgets/gallery-viewer";
import { BlogViewer } from "@widgets/blog-viewer";
import { CommissionSheet } from "@widgets/commissions-viewer";
import {
  Testimonials,
  TechStack,
  Projects,
  Certificates,
  Affiliations,
} from "@widgets/placeholder-tabs";
import { AdminLogin } from "@features/auth";
import { AdminDashboard } from "@widgets/admin-dashboard";
import { useIsTablet } from "@shared/hooks";
import type { Tab } from "@shared/config/tabs";
import type { Friend } from "@entities/friend";
import type { BlogPost } from "@entities/blog-post";
import type { CommissionInfo } from "@entities/commission";

type HomeClientProps = {
  friends: Friend[];
  posts: BlogPost[];
  initialTab: Tab;
  commissionInfo: CommissionInfo;
};

/** Names shown in the tablet content navbar. */
const TAB_TITLES: Record<Tab, string> = {
  main: "Profile",
  projects: "Projects",
  commissions: "Commissions",
  gallery: "Gallery",
  blog: "Blog",
  admin: "Admin",
  dashboard: "Dashboard",
  testimonials: "Testimonials",
  techstack: "Tech Stack",
  certificates: "Certificates",
  affiliations: "Affiliations",
};

export default function HomeClient({
  friends,
  posts,
  initialTab,
  commissionInfo,
}: HomeClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab === "main" ? "projects" : initialTab);
  const isTablet = useIsTablet();
  // tablet and below: the page is either the character home or one tab's full-page content
  const [contentOpen, setContentOpen] = useState(false);

  // a link straight to ?tab=… opens that tab's page
  useEffect(() => {
    if (new URL(window.location.href).searchParams.has("tab")) setContentOpen(true);
  }, []);

  const selectTab = useCallback((tab: Tab) => {
    setActiveTab(tab);
    setContentOpen(true);
    window.scrollTo(0, 0);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState(null, "", url);
  }, []);

  const closeContent = useCallback(() => {
    setContentOpen(false);
    window.scrollTo(0, 0);
    const url = new URL(window.location.href);
    url.searchParams.delete("tab");
    window.history.replaceState(null, "", url);
  }, []);

  const mode = !isTablet ? "full" : contentOpen ? "content" : "home";

  return (
    <div className="container-page">
      <div className="bg-decor" />
      <div className="container-main-decor-fur">
        <div className="container-main-decor">
          <ProfileMainView onTabChange={selectTab} friends={friends} mode={mode} onBack={closeContent} title={TAB_TITLES[activeTab]}>
            {mode !== "home" && (
              <>
                {activeTab === "projects"     && <Projects />}
                {activeTab === "commissions"  && <CommissionSheet info={commissionInfo} />}
                {activeTab === "gallery"      && <GalleryViewer />}
                {activeTab === "blog"         && <BlogViewer posts={posts} />}
                {activeTab === "admin"        && <AdminLogin />}
                {activeTab === "dashboard"    && <AdminDashboard onNavigateTab={selectTab} isActive />}
                {activeTab === "testimonials" && <Testimonials />}
                {activeTab === "techstack"    && <TechStack />}
                {activeTab === "certificates" && <Certificates />}
                {activeTab === "affiliations" && <Affiliations />}
              </>
            )}
          </ProfileMainView>
        </div>
      </div>
    </div>
  );
}

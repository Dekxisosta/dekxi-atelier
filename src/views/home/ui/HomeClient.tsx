"use client";

import { useCallback, useState } from "react";
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

export default function HomeClient({
  friends,
  posts,
  initialTab,
  commissionInfo,
}: HomeClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab === "main" ? "projects" : initialTab);

  const selectTab = useCallback((tab: Tab) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState(null, "", url);
  }, []);

  return (
    <div className="container-page">
      <div className="bg-decor" />
      <div className="container-main-decor-fur">
        <div className="container-main-decor">
          <ProfileMainView onTabChange={selectTab} friends={friends}>
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
          </ProfileMainView>
        </div>
      </div>
    </div>
  );
}

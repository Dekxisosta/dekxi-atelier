"use client";

import { useCallback, useState } from "react";
import { IdeHeader } from "@widgets/ide-header";
import { ProfileMainView } from "@widgets/profile-main";
import { GalleryViewer } from "@widgets/gallery-viewer";
import { BlogViewer } from "@widgets/blog-viewer";
import { MootsViewer } from "@widgets/moots-viewer";
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
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

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
          <IdeHeader activeTab={activeTab} onTabChange={selectTab} />

          <div style={{ display: activeTab === "main"         ? "block" : "none" }}><ProfileMainView /></div>
          <div style={{ display: activeTab === "commissions"  ? "block" : "none" }}><CommissionSheet info={commissionInfo} /></div>
          <div style={{ display: activeTab === "gallery"      ? "block" : "none" }}><GalleryViewer /></div>
          <div style={{ display: activeTab === "testimonials" ? "block" : "none" }}><Testimonials /></div>
          <div style={{ display: activeTab === "techstack"    ? "block" : "none" }}><TechStack /></div>
          <div style={{ display: activeTab === "projects"     ? "block" : "none" }}><Projects /></div>
          <div style={{ display: activeTab === "certificates" ? "block" : "none" }}><Certificates /></div>
          <div style={{ display: activeTab === "affiliations" ? "block" : "none" }}><Affiliations /></div>
          <div style={{ display: activeTab === "blog"         ? "block" : "none" }}><BlogViewer posts={posts} /></div>
          <div style={{ display: activeTab === "moots"        ? "block" : "none" }}><MootsViewer friends={friends} /></div>
          <div style={{ display: activeTab === "admin"        ? "block" : "none" }}><AdminLogin /></div>
          <div style={{ display: activeTab === "dashboard"    ? "block" : "none" }}><AdminDashboard onNavigateTab={selectTab} isActive={activeTab === "dashboard"} /></div>
        </div>
      </div>
    </div>
  );
}

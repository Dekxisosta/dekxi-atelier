"use client";

import { useCallback, useState } from "react";
import IdeHeader from "@/components/IdeHeader";
import Main from "./Main";
import Blog from "./Blog";
import Moots from "./Moots";
import AdminLogin from "./AdminLogin";
import type { Friend, BlogPost } from "../page";
import type { Tab } from "@/lib/tabs";

type HomeClientProps = {
  friends: Friend[];
  posts: BlogPost[];
  initialTab: Tab;
};

export default function HomeClient({ friends, posts, initialTab }: HomeClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  const selectTab = useCallback((tab: Tab) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState(null, "", url);
  }, []);

  return (
    <div className="container-page">
      <div className="bg-decor"></div>
      <div className="container-main-decor-fur">
        <div className="container-main-decor">
          <IdeHeader activeTab={activeTab} onTabChange={selectTab} />

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
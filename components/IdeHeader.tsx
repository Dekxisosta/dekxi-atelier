"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  {
    href: "/",
    label: "profile.ego",
    route: "/profile",
    icon: "person-outline",
    path: "L-CORP / ARCHIVES / FILE_NO_000"
  },
  {
    href: "/moots",
    label: "mutuals.list",
    route: "/moots",
    icon: "people-outline",
    path: "L-CORP / ARCHIVES / MOOTS_LOG"
  },
  {
    href: "/blog",
    label: "blog.log",
    route: "/blog",
    icon: "reader-outline",
    path: "L-CORP / ARCHIVES / BLOG_ENTRIES"
  },
  {
    href: "/admin/login",
    label: "admin.sys",
    route: "/admin",
    icon: "lock-closed-outline",
    path: "L-CORP / ARCHIVES / RESTRICTED"
  }
];

export default function IdeHeader() {
  const pathname = usePathname();
  const active =
    TABS.find((t) => (t.href === "/" ? pathname === "/" : pathname.startsWith(t.href))) ??
    TABS[0];

  return (
    <div className="ide-header-bar">
      <div className="ide-header-bar">
        <div className="ide-header-controls">
          <span className="ide-dot ide-dot-red"></span>
          <span className="ide-dot ide-dot-yellow"></span>
          <span className="ide-dot ide-dot-green"></span>
        </div>
        <div className="ide-header-tabs">
          {TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={
                "ide-header-tab" +
                (tab.href === active.href ? " ide-header-tab-active" : "")
              }
              data-path={tab.path}
            >
              <ion-icon name={tab.icon} className="ide-header-tab-icon"></ion-icon>
              <span className="ide-header-tab-label">{tab.label}</span>
              <span className="ide-header-tab-route">{tab.route}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="ide-header-path">{active.path}</div>
    </div>
  );
}

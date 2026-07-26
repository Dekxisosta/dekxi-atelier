export const TAB_IDS = ["main", "gallery", "blog", "moots", "commissions", "admin", "dashboard"] as const;
export type Tab = (typeof TAB_IDS)[number];

export const DEFAULT_TAB: Tab = "main";

export function isTab(value: string | undefined | null): value is Tab {
  return !!value && (TAB_IDS as readonly string[]).includes(value);
}

export const TAB_META: { id: Tab; label: string; icon: string; path: string }[] = [
  { id: "main", label: "profile.ego", icon: "person-outline", path: "~/main" },
  { id: "blog", label: "blog.csv", icon: "reader-outline", path: "~/blog" },
  { id: "moots", label: "moots.tab", icon: "people-outline", path: "~/moots" },
  { id: "gallery", label: "gallery.psd", icon: "images-outline", path: "~/gallery" },
  { id: "commissions", label: "commissions.md", icon: "brush-outline", path: "~/commissions" },
  { id: "admin", label: "admin-sys.jsx", icon: "lock-closed-outline", path: "~/admin/login" },
  { id: "dashboard", label: "dashboard.sys", icon: "grid-outline", path: "~/admin/dashboard" }
];
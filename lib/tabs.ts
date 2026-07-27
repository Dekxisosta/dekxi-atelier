export const TAB_IDS = [
  "main",
  "gallery",
  "commissions",
  "testimonials",
  "techstack",
  "projects",
  "certificates",
  "affiliations",
  "blog",
  "moots",
  "admin",
  "dashboard",
] as const;
export type Tab = (typeof TAB_IDS)[number];

export const DEFAULT_TAB: Tab = "main";

export function isTab(value: string | undefined | null): value is Tab {
  return !!value && (TAB_IDS as readonly string[]).includes(value);
}

export const TAB_META: { id: Tab; label: string; icon: string; path: string }[] = [
  { id: "main", label: "profile.ego", icon: "person-outline", path: "~/main" },
  { id: "gallery", label: "gallery.psd", icon: "images-outline", path: "~/work/gallery" },
  { id: "commissions", label: "commissions.md", icon: "brush-outline", path: "~/work/commissions" },
  { id: "testimonials", label: "testimonials.log", icon: "chatbox-ellipses-outline", path: "~/work/testimonials" },
  { id: "techstack", label: "stack.roadmap", icon: "layers-outline", path: "~/dev/stack" },
  { id: "projects", label: "projects.repo", icon: "code-slash-outline", path: "~/dev/projects" },
  { id: "certificates", label: "certs.log", icon: "ribbon-outline", path: "~/dev/certs" },
  { id: "affiliations", label: "affiliations.net", icon: "business-outline", path: "~/dev/affiliations" },
  { id: "blog", label: "blog.csv", icon: "reader-outline", path: "~/main/blog" },
  { id: "moots", label: "moots.tab", icon: "people-outline", path: "~/main/moots" },
  { id: "admin", label: "admin-sys.jsx", icon: "lock-closed-outline", path: "~/admin/login" },
  { id: "dashboard", label: "dashboard.sys", icon: "grid-outline", path: "~/admin/dashboard" },
];
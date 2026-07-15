import type { Metadata } from "next";

const SITE_DESCRIPTION =
  "CS student · full-stack app builder · roblox studio dev · UI / Visual Design";
const AVATAR_URL = "https://avatars.githubusercontent.com/u/201718391?v=4";

export const siteMetadata: Metadata = {
  title: "dekxisosta - Dekxi's Linktree",
  description: SITE_DESCRIPTION,
  icons: { icon: "/assets/icon/favico.ico" },
  openGraph: {
    type: "website",
    title: "Dekxisosta / Links",
    description: SITE_DESCRIPTION,
    images: [AVATAR_URL],
    url: "https://dekxisosta.vercel.app"
  },
  twitter: {
    card: "summary",
    title: "Dekxisosta / Links",
    description: SITE_DESCRIPTION,
    images: [AVATAR_URL],
    site: "@rroquxii56443",
    creator: "@rroquxii56443"
  },
  themeColor: "#1c191d"
};
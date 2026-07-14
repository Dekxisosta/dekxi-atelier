import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "dekxisosta - Dekxi's Linktree",
  description:
    "CS student · full-stack app builder · roblox studio dev · UI / Visual Design",
  icons: { icon: "/assets/icon/favico.ico" },
  openGraph: {
    type: "website",
    title: "Dekxisosta / Links",
    description:
      "CS student · full-stack app builder · roblox studio dev · UI / Visual Design",
    images: ["https://avatars.githubusercontent.com/u/201718391?v=4"],
    url: "https://dekxisosta.vercel.app"
  },
  twitter: {
    card: "summary",
    title: "Dekxisosta / Links",
    description:
      "CS student · full-stack app builder · roblox studio dev · UI / Visual Design",
    images: ["https://avatars.githubusercontent.com/u/201718391?v=4"],
    site: "@rroquxii56443",
    creator: "@rroquxii56443"
  },
  themeColor: "#1c191d"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          type="module"
          src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"
          strategy="afterInteractive"
        />
        <Script
          noModule
          src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

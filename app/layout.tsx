import "./globals.css";
import { siteMetadata } from "@/lib/metadata";
import IoniconsLoader from "@/components/layout/IoniconsLoader";

export const metadata = siteMetadata;

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <IoniconsLoader />
      </body>
    </html>
  );
}
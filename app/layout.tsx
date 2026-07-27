import "./globals.css";
import { siteMetadata } from "@/lib/metadata";
import IoniconsLoader from "@/components/layout/IoniconsLoader";
import { ThemeProvider } from "@/contexts/ThemeContext";

export const metadata = siteMetadata;

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('theme');
                  if (t) document.documentElement.setAttribute('data-theme', t);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          {children}
          <IoniconsLoader />
        </ThemeProvider>
      </body>
    </html>
  );
}
import "./globals.css";
import { siteMetadata, siteViewport } from "@shared/config/metadata";
import { IoniconsLoader, ThemeProvider } from "@shared/ui";

export const metadata = siteMetadata;
export const viewport = siteViewport;

export default function RootLayout({ children }: { children: React.ReactNode }) {
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

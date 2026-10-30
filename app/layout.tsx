import "./globals.css";
import { siteMetadata, siteViewport } from "@shared/config/metadata";
import { IoniconsLoader, ThemeProvider } from "@shared/ui";

export const metadata = siteMetadata;
export const viewport = siteViewport;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="azurlane" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('theme');
                  if (t === 'verdant' || t === 'amber') t = 'ishmael';
                  var ok = ['azurlane', 'moonlight', 'rosewood', 'ishmael'];
                  document.documentElement.setAttribute('data-theme', ok.indexOf(t) > -1 ? t : 'azurlane');
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

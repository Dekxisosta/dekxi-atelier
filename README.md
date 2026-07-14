# dekxi links — Next.js conversion

Converted from the vanilla HTML/CSS/JS linktree project into Next.js 14
(App Router, TypeScript). CSS was kept as **plain CSS** (your `globals.css`
and `admin.css`), not rewritten into Tailwind — imported directly, no
conversion needed.

## Structure

```
app/
  layout.tsx            root layout, imports globals.css, loads ionicons
  globals.css           your original stylesheet (font paths updated to /public)
  page.tsx              home / profile page
  moots/page.tsx         mutuals list — server-fetched from Supabase, shuffled server-side
  blog/page.tsx          blog list — server-fetched from Supabase
  blog/[slug]/page.tsx   single blog post
  admin/
    admin.css            admin-only styles (imported only on admin routes)
    login/page.tsx        client component, Supabase password sign-in
    dashboard/page.tsx     server wrapper (auth already gated by middleware.ts)
components/
  IdeHeader.tsx           shared IDE-style tab bar, active tab driven by the route
  AdminDashboardClient.tsx  Friends/Blog CRUD (client component)
lib/supabase/
  client.ts               browser Supabase client
  server.ts               server Supabase client (Server Components)
middleware.ts             gates /admin/dashboard before any HTML is sent —
                           this is what removes the login-redirect flash
public/assets/            fonts, icons, friend cover images
sql/admin-policies.sql     your RLS policies (unchanged, for reference)
```

## Setup

```bash
npm install
cp .env.local.example .env.local
```

Fill in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from your
  Supabase project settings (values already prefilled from your old script.js).
- `ADMIN_USER_IDS` — your admin user's UUID from Supabase Auth → Users
  (comma-separate if you ever add more than one admin). This is read by
  `middleware.ts` to decide who can reach `/admin/dashboard`.

Then:

```bash
npm run dev
```

## Notes on what changed vs. the vanilla version

- **Auth guard moved to `middleware.ts`.** The old `admin/dashboard/script.js`
  checked the session *after* the page had already rendered client-side,
  which is what caused the login-redirect flash. Middleware runs before the
  request reaches the page at all, so an unauthorized request never
  receives the dashboard HTML.
- **Friends shuffle is server-side** in `moots/page.tsx` (Fisher-Yates),
  same as before, just running per-request on the server rather than in
  browser JS.
- **IDE tab bar** (`IdeHeader.tsx`) no longer uses `display:none` view
  switching — each tab is a real route now (`/`, `/moots`, `/blog`,
  `/admin/login`), and the active tab is derived from `usePathname()`.
- **CSS is untouched structurally** — `globals.css` and `admin.css` are the
  same files, just relocated; only the two `@font-face` `url(...)` paths
  were rewritten to point at `/assets/fonts/...` under `public/`.
- Admin dashboard CRUD (`AdminDashboardClient.tsx`) is a fairly direct port
  of your `admin-dashboard.js` logic into React state — same Supabase calls,
  same field names, same table structure.

## Not yet done (left for you)

- The blog admin editor writes `content` as plain text; if you want rich
  formatting you'll need to add a markdown renderer on `blog/[slug]/page.tsx`.
- No `og:image`/favicon variants beyond what the old `<head>` had.
- `admin.css` was imported as global CSS, not converted to a CSS Module —
  say the word if you want that scoping too.

# Dekxi Atelier

Dekxi's personal corner of the internet — part linktree, part portfolio, part devlog. One page holds a bio, social links, live status widgets, a blog, and a directory of moots (friends).

> [!NOTE]
> Built with Next.js and Supabase, deployed on Vercel.

## Core Features

- **Profile & links hub** — avatar, bio, tech stack icons, and quick links out to socials, GitHub, portfolio, and contact
- **About Me** — BYF/DNI, favorite anime, vtubers, games, music, and manhwa, laid out as scannable tag groups
- **Live status widgets** — real-time-ish cards for Steam, Spotify ("what's playing"), and Codewars stats
- **Blog** — devlog-style posts with cover images and dates, linking out to full entries
- **Moots directory** — a responsive grid of friend cards (cover image, avatar, bio, tags, social badges, "view profile" link), each with a consistent bottom-aligned footer regardless of how much content a card has
- **Secure terminal easter egg** — an admin-styled tile puzzle gate (tap 1–6 in order) tucked at the bottom of the page

## Theming

Colors, borders, and fonts are driven by CSS custom properties (`--accent`, `--bg`, `--border`, `--radius-card`, etc.), so the whole look can be restyled from one place.
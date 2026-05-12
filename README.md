# DevFolio

Terminal-styled developer portfolio that aggregates your **GitHub activity**, **learning streaks**, and **pinned code snippets** into one shareable, server-rendered page. The central hub of the **DevEco** ecosystem — twelve connected developer tools, one unified Supabase backend.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Auth + DB | Supabase (GitHub OAuth + Postgres) |
| Animations | Framer Motion |
| Icons | React Icons (Remix set) |
| Font | JetBrains Mono |

---

## Features

- **GitHub aggregation** — profile, repos, contributions, language breakdown pulled live from the GitHub REST API
- **Learning streaks** — sync your daily learning calendar and show consistent practice, not just commits
- **Pinned snippets** — showcase your best code with syntax highlighting and one-click copy
- **Stat dashboards** — streaks, totals, language breakdown, repo cards
- **One shareable link** — `devfolio.sh/yourname`, server-rendered with OG previews
- **Terminal aesthetic** — dark neon mono UI, every section styled as a terminal card
- **GitHub OAuth** — sign in and manage your profile from the dashboard

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Create `.env.local` from `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GITHUB_TOKEN=your_github_personal_access_token
```

### Supabase setup

1. Run `supabase/schema.sql` in the Supabase SQL Editor
2. Enable GitHub provider in **Authentication → Providers**
3. Add `http://localhost:3000/api/auth/callback` to **Authentication → URL Configuration → Redirect URLs**

---

## Routes

| Route | Description |
|---|---|
| `/` | Landing page — hero, features, ecosystem grid |
| `/[slug]` | Public developer profile (GitHub-backed) |
| `/dashboard` | Auth-gated profile editor |
| `/api/auth/signin` | Initiates GitHub OAuth flow |
| `/api/auth/callback` | OAuth callback — exchanges code, sets session cookie |

---

## Project Structure

```
DevFolio/
├── app/
│   ├── layout.tsx               # root layout — fonts, navbar, footer
│   ├── page.tsx                 # landing page
│   ├── globals.css              # design tokens, terminal helpers
│   ├── not-found.tsx            # 404 terminal page
│   ├── [slug]/page.tsx          # public profile route
│   ├── dashboard/page.tsx       # auth-gated editor
│   └── api/auth/
│       ├── signin/route.ts      # server-side OAuth initiation
│       └── callback/route.ts    # session exchange + redirect
├── components/
│   ├── layout/                  # Navbar, Footer
│   ├── home/                    # Hero, Features, EcoSystem
│   ├── auth/                    # AuthButton
│   ├── profile/                 # ProfileHeader, GitHubStats, LearningStreaks,
│   │                            # PinnedSnippets, PinnedRepos
│   └── ui/                      # TerminalCard, StatTile, ShareButton
├── lib/
│   ├── ecosystem.ts             # DevEco app registry + URLs
│   ├── supabase.ts              # browser Supabase client
│   ├── supabase-server.ts       # server Supabase client (cookie-based)
│   ├── profile.ts               # profile + auth helpers
│   ├── github.ts                # GitHub API helpers
│   ├── theme.ts                 # design tokens
│   └── mockData.ts              # dev mock profile
├── supabase/
│   └── schema.sql               # full schema — all 13 tables with RLS
└── proxy.ts                     # Next.js middleware — session refresh
```

---

## DevEco Ecosystem

DevFolio is the public-facing hub. All apps share a single Supabase project.

| App | Description | URL |
|---|---|---|
| **DevFolio** | Developer portfolio hub | This repo |
| **DevBlog** | Write & publish dev posts | — |
| **DevResume** | Generate PDF resume | — |
| **DevRoadmap** | Skill learning tracks | — |
| **DevCalendar** | Schedule & goals | — |
| **DevTimer** | Pomodoro focus timer | — |
| **DevNotes** | Markdown notes | — |
| **DevStatus** | Project status pages | — |
| **DevEnv** | Environment vault | — |
| **DevWidgets** | Embeddable widgets | — |
| **DevShare** | Share & showcase code snippets | [code-share-lovat.vercel.app](https://code-share-lovat.vercel.app) |
| **DevPulse** | Dev activity & pulse tracker | [dev-pulse-black.vercel.app](https://dev-pulse-black.vercel.app) |

### Shared Supabase schema

```
[Supabase Project]
├── profiles               ← shared user identity
├── snippets               ← DevFolio + DevShare
├── blog_posts             ← DevBlog
├── notes                  ← DevNotes
├── timer_sessions         ← DevTimer
├── calendar_events        ← DevCalendar
├── calendar_goals         ← DevCalendar
├── roadmap_progress       ← DevRoadmap
├── status_pages           ← DevStatus
├── incidents              ← DevStatus
├── env_projects           ← DevEnv
├── github_cache           ← populated by GitHub API
└── learning_goals         ← DevFolio + DevCalendar
```

All tables have Row Level Security (RLS) enabled.

---

## Design System

Terminal / Linux / GitHub-inspired aesthetic.

| Token | Hex | Use |
|---|---|---|
| `bg` | `#05070F` | scaffold background |
| `surface` | `#0B1020` | nav, cards |
| `neon-cyan` | `#00E5FF` | primary accents |
| `neon-green` | `#00FFA3` | success, `$` prompt |
| `neon-blue` | `#4D8CFF` | secondary |
| `neon-purple` | `#8A5BFF` | snippets accent |
| `neon-red` | `#FF3D71` | errors, destructive |
| `neon-amber` | `#FFB547` | warnings, streaks |

Tokens are mirrored in `app/globals.css` (CSS vars) and `lib/theme.ts` (TS export).

---

## Roadmap

- [x] Landing page + terminal UI component library
- [x] Public profile route (`/[slug]`)
- [x] Supabase auth wired — GitHub OAuth, session cookies, middleware
- [x] Shared Supabase schema (13 tables, full RLS)
- [x] DevEco ecosystem grid — 12 apps connected
- [ ] Replace mock data with live Supabase queries
- [ ] OG image generation (`opengraph-image.tsx`)
- [ ] `/api/u/[slug]` JSON endpoint for widget embedding
- [ ] Custom domain — `yourname.devfolio.sh`
- [ ] Theme switcher (terminal / GitHub light / cyberpunk)

---

## License

MIT
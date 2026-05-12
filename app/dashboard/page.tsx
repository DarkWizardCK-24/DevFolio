import { createClient } from '@/lib/supabase-server';
import AuthButton from '@/components/auth/AuthButton';
import TerminalCard from '@/components/ui/TerminalCard';
import { ECOSYSTEM } from '@/lib/ecosystem';
import {
  RiUser3Line,
  RiGithubFill,
  RiBookmarkLine,
  RiSettings3Line,
  RiLinkM,
  RiDatabase2Line,
  RiCheckboxCircleLine,
  RiTimeLine,
} from 'react-icons/ri';

const supabaseTables = [
  // DevFolio
  { name: 'profiles',        app: 'DevFolio',    desc: 'username, bio, status, tags, website — one row per user' },
  { name: 'learning_goals',  app: 'DevFolio',    desc: 'goal name, target_days, elapsed_days, started_at' },
  { name: 'snippets',        app: 'DevFolio',    desc: 'title, language, code, description, pinned (bool)' },
  { name: 'github_cache',    app: 'DevFolio',    desc: 'cached GH API response keyed by username + fetched_at' },
  // DevBlog
  { name: 'blog_posts',      app: 'DevBlog',     desc: 'title, slug, content_md, tags, published_at, author_id' },
  // DevNotes
  { name: 'notes',           app: 'DevNotes',    desc: 'title, content_md, tags[], created_at, updated_at, user_id' },
  // DevTimer
  { name: 'timer_sessions',  app: 'DevTimer',    desc: 'duration_secs, mode, completed_at, user_id' },
  // DevCalendar
  { name: 'calendar_events', app: 'DevCalendar', desc: 'title, date, time, type, done, note, user_id' },
  { name: 'calendar_goals',  app: 'DevCalendar', desc: 'title, deadline, progress, color, user_id' },
  // DevRoadmap
  { name: 'roadmap_progress',app: 'DevRoadmap',  desc: 'track_id, skill_id, completed_at, user_id' },
  // DevStatus
  { name: 'status_pages',    app: 'DevStatus',   desc: 'username, display_name, services jsonb, user_id' },
  { name: 'incidents',       app: 'DevStatus',   desc: 'title, status, severity, updates jsonb, status_page_id' },
  // DevEnv
  { name: 'env_projects',    app: 'DevEnv',      desc: 'name, description, vars jsonb (encrypt in prod), user_id' },
  // DevWidgets — no DB (live GitHub API + embed only)
  // DevResume  — no DB (live GitHub API + print)
];

const envVars = [
  { key: 'NEXT_PUBLIC_SUPABASE_URL',      where: '.env.local', note: 'Project URL from Supabase dashboard → Settings → API' },
  { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', where: '.env.local', note: 'Anon/public key — safe to expose in browser' },
  { key: 'SUPABASE_SERVICE_ROLE_KEY',     where: '.env.local', note: 'Service role key — server-only, never expose to client' },
  { key: 'GITHUB_TOKEN',                  where: '.env.local', note: 'Personal access token — boosts rate limit to 5 000 req/hr' },
];

export default async function DashboardPage() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  const githubUsername = user?.user_metadata?.user_name as string | undefined;

  const sections = [
    { icon: RiUser3Line,      label: 'Edit profile', desc: 'Bio, avatar, status, skill tags',   ready: !!user },
    { icon: RiGithubFill,     label: 'GitHub sync',  desc: 'Connect / re-sync GitHub data',     ready: true   },
    { icon: RiBookmarkLine,   label: 'Pinned items', desc: 'Curate repos and code snippets',    ready: !!user },
    { icon: RiLinkM,          label: 'Public URL',   desc: 'Your slug, SEO & OG settings',      ready: !!user },
    { icon: RiSettings3Line,  label: 'Account',      desc: 'Email, password, danger zone',      ready: !!user },
  ];

  return (
    <div className="container-app py-10 space-y-6">
      <div>
        <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-neon-green)]">
          $ sudo dashboard --status
        </div>
        <h1 className="mt-2 text-2xl font-bold">Manage your DevFolio</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          {user
            ? `Signed in as @${githubUsername} — your profile is live.`
            : 'Phase 1 — Supabase auth & persistence. Connect your database to unlock everything below.'}
        </p>
      </div>

      {/* Auth status */}
      <TerminalCard
        title="$ devfolio status"
        subtitle={user ? `authenticated · @${githubUsername}` : 'not authenticated'}
        glow="cyan"
      >
        {user ? (
          <div className="flex items-center gap-4 flex-wrap">
            {user.user_metadata?.avatar_url && (
              <img
                src={user.user_metadata.avatar_url as string}
                alt={githubUsername}
                className="w-10 h-10 rounded-full border border-[var(--color-neon-cyan)]"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold">
                {(user.user_metadata?.full_name as string) ?? githubUsername}
              </div>
              <div className="text-xs text-[var(--color-neon-green)] font-mono mt-0.5">
                @{githubUsername}
              </div>
              <a
                href={`/${githubUsername}`}
                className="text-[11px] text-[var(--color-neon-cyan)] hover:underline mt-1 inline-block"
              >
                view public profile →
              </a>
            </div>
            <div className="shrink-0">
              <AuthButton />
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed flex-1">
              Sign in with GitHub via Supabase Auth to manage your profile. Once you connect
              the database, the button activates and creates your DevFolio account automatically.
            </p>
            <div className="shrink-0">
              <AuthButton />
            </div>
          </div>
        )}
      </TerminalCard>

      {/* Dashboard sections */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <div
            key={s.label}
            className={`border rounded p-5 transition-colors ${
              s.ready
                ? 'border-[var(--color-neon-cyan)] bg-[rgba(0,229,255,0.04)] cursor-pointer hover:bg-[rgba(0,229,255,0.08)]'
                : 'border-[var(--color-border)] opacity-60 cursor-not-allowed'
            }`}
          >
            <div className="flex items-start justify-between">
              <s.icon
                className={s.ready ? 'text-[var(--color-neon-cyan)]' : 'text-[var(--color-text-dim)]'}
                size={20}
              />
              {s.ready ? (
                <RiCheckboxCircleLine size={14} className="text-[var(--color-neon-green)]" />
              ) : (
                <RiTimeLine size={14} className="text-[var(--color-text-dim)]" />
              )}
            </div>
            <div className="mt-3 text-sm font-semibold">{s.label}</div>
            <div className="mt-1 text-xs text-[var(--color-text-muted)]">{s.desc}</div>
            {!s.ready && (
              <div className="mt-2 text-[10px] text-[var(--color-text-dim)]">requires auth</div>
            )}
          </div>
        ))}
      </div>

      {/* Ecosystem quick launch */}
      <TerminalCard title="$ ls ~/deveco/apps/" subtitle="10 apps" glow="cyan">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {ECOSYSTEM.filter(a => a.slug !== 'folio').map(app => (
            <a
              key={app.slug}
              href={app.url}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col gap-1 p-2.5 rounded border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition-all group"
            >
              <span className="text-base">{app.icon}</span>
              <span className="text-[11px] font-semibold group-hover:underline" style={{ color: app.color }}>
                {app.name}
              </span>
              <span className="text-[10px] text-[var(--color-text-dim)] leading-tight">{app.desc}</span>
            </a>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-[var(--color-text-dim)]">
          Make sure each app is running with{' '}
          <code className="text-[var(--color-neon-cyan)]">npm run dev</code>, or use{' '}
          <code className="text-[var(--color-neon-cyan)]">dev status</code> from DevCLI.
        </p>
      </TerminalCard>

      {/* Supabase setup guide */}
      <TerminalCard title="$ cat ~/setup/supabase.md" subtitle="integration guide" glow="green">
        <div className="space-y-6 text-sm">

          <div>
            <div className="text-[10px] uppercase tracking-widest text-[var(--color-neon-green)] mb-2">
              step 1 — create project
            </div>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              Go to{' '}
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-[var(--color-neon-cyan)] hover:underline"
              >
                supabase.com/dashboard
              </a>{' '}
              → New project. Name it{' '}
              <code className="text-[var(--color-neon-amber)]">deveco</code>.
              Enable GitHub OAuth under Authentication → Providers.
            </p>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-widest text-[var(--color-neon-green)] mb-2">
              step 2 — env variables (.env.local)
            </div>
            <div className="rounded border border-[var(--color-border)] divide-y divide-[var(--color-border)] font-mono text-xs">
              {envVars.map((v) => (
                <div key={v.key} className="p-3 grid sm:grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                  <span className="text-[var(--color-neon-cyan)]">{v.key}</span>
                  <span className="text-[var(--color-text-dim)]">// {v.note}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-widest text-[var(--color-neon-green)] mb-2">
              step 3 — run schema (SQL editor → supabase/schema.sql)
            </div>
            <div className="rounded border border-[var(--color-border)] divide-y divide-[var(--color-border)] text-xs">
              {supabaseTables.map((t) => (
                <div key={t.name} className="p-3 flex gap-3 items-start">
                  <RiDatabase2Line size={13} className="text-[var(--color-neon-purple)] shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[var(--color-neon-cyan)]">{t.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded border border-[var(--color-border)] text-[var(--color-text-dim)]">
                        {t.app}
                      </span>
                    </div>
                    <span className="text-[var(--color-text-muted)]">{t.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-widest text-[var(--color-neon-green)] mb-2">
              step 4 — github oauth callback url
            </div>
            <div className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] p-3 font-mono text-xs space-y-1">
              <div className="text-[var(--color-text-muted)]">
                # Add to GitHub OAuth App → Authorization callback URL:
              </div>
              <div>
                <span className="text-[var(--color-neon-green)]">local</span>{' '}
                <span className="text-[var(--color-text)]">http://localhost:3000/api/auth/callback</span>
              </div>
              <div>
                <span className="text-[var(--color-neon-green)]">prod </span>{' '}
                <span className="text-[var(--color-text)]">https://your-domain.com/api/auth/callback</span>
              </div>
              <div className="text-[var(--color-text-muted)] mt-1">
                # Also set in Supabase: Auth → URL Configuration → Redirect URLs
              </div>
            </div>
          </div>

        </div>
      </TerminalCard>
    </div>
  );
}

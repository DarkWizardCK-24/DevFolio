import {
  RiGithubFill,
  RiCalendarLine,
  RiCodeSSlashLine,
  RiBarChartBoxLine,
  RiShareLine,
  RiTerminalBoxLine,
} from 'react-icons/ri';

const features = [
  {
    icon: RiGithubFill,
    title: 'GitHub aggregation',
    desc: 'Profile, repos, contributions, language breakdown — pulled live from the GitHub REST API.',
    color: 'var(--color-neon-cyan)',
  },
  {
    icon: RiCalendarLine,
    title: 'Learning streaks',
    desc: 'Sync your daily learning calendar. Show off a real, consistent practice — not just commits.',
    color: 'var(--color-neon-green)',
  },
  {
    icon: RiCodeSSlashLine,
    title: 'Pinned snippets',
    desc: 'Showcase your best code. Syntax-highlighted, shareable, with one-click copy.',
    color: 'var(--color-neon-purple)',
  },
  {
    icon: RiBarChartBoxLine,
    title: 'Stat dashboards',
    desc: 'Streaks, totals, language pie, repo cards — the kind of metrics recruiters skim for.',
    color: 'var(--color-neon-amber)',
  },
  {
    icon: RiShareLine,
    title: 'One link, your dev life',
    desc: 'devfolio.sh/yourname — a single, shareable, server-rendered page with OG previews.',
    color: 'var(--color-neon-blue)',
  },
  {
    icon: RiTerminalBoxLine,
    title: 'Terminal aesthetic',
    desc: 'Dark, neon, mono. Every section is a styled terminal card. Built for devs.',
    color: 'var(--color-neon-cyan)',
  },
];

export default function Features() {
  return (
    <section className="container-app py-20 border-t border-[var(--color-border)]">
      <div className="mb-10">
        <div className="text-xs uppercase tracking-[0.25em] text-[var(--color-neon-green)]">
          $ ls /features
        </div>
        <h2 className="mt-2 text-2xl sm:text-3xl font-bold">What ships in v0.1</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="border border-[var(--color-border)] rounded-md p-5 bg-[rgba(15,20,40,0.3)] hover:border-[var(--color-border-strong)] transition-colors group"
          >
            <f.icon size={22} style={{ color: f.color }} />
            <h3 className="mt-3 text-base font-semibold text-[var(--color-text)]">
              {f.title}
            </h3>
            <p className="mt-1.5 text-sm text-[var(--color-text-muted)] leading-relaxed">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

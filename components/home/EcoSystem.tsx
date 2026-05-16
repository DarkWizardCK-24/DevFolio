import { ECOSYSTEM } from '@/lib/ecosystem';

export default function EcoSystem() {
  return (
    <section className="container-app py-20 border-t border-[var(--color-border)]">
      <div className="mb-10">
        <div className="text-xs uppercase tracking-[0.25em] text-[var(--color-neon-green)]">
          $ ls /deveco/apps/
        </div>
        <h2 className="mt-2 text-2xl sm:text-3xl font-bold">The DevEco Ecosystem</h2>
        <p className="mt-2 text-sm text-[var(--color-text-muted)] max-w-2xl leading-relaxed">
          DevFolio is the hub. Twelve connected tools — each standalone, all speaking the same language.
          Your entire dev life in one terminal-styled suite.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ECOSYSTEM.filter(app => app.slug !== 'folio').map(app => (
          <a
            key={app.slug}
            href={app.url}
            className="group flex items-start gap-4 p-4 rounded border border-[var(--color-border)] bg-[rgba(15,20,40,0.3)] hover:bg-[rgba(15,20,40,0.6)] transition-all hover:scale-[1.01]"
            style={{ boxShadow: `0 0 0 1px ${app.color}00`, ['--hover-glow' as string]: `0 0 0 1px ${app.color}30` }}
          >
            <div
              className="w-9 h-9 rounded flex items-center justify-center text-base shrink-0 mt-0.5"
              style={{ background: `${app.color}15`, border: `1px solid ${app.color}30` }}
            >
              {app.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold" style={{ color: app.color }}>{app.name}</span>
                <span className="text-[10px] text-[var(--color-text-dim)] group-hover:text-[var(--color-text-muted)] transition-colors">
                  → open
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5 leading-relaxed">{app.desc}</p>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-8 p-4 rounded border border-[var(--color-border)] bg-[rgba(0,229,255,0.03)] text-xs text-[var(--color-text-dim)]">
        <span className="text-[var(--color-neon-green)]">$</span> deveco --status
        <span className="ml-3 text-[var(--color-text-dim)]">
          run each app with <code className="text-[var(--color-neon-cyan)]">npm run dev</code> in its directory,
          or use <code className="text-[var(--color-neon-cyan)]">dev status</code> via DevCLI to check them all at once
        </span>
      </div>
    </section>
  );
}

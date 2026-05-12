import { RiGithubFill, RiTwitterXFill, RiLinkedinFill } from 'react-icons/ri';
import { DEFAULT_GITHUB_USERNAME } from '@/lib/config';
import { ECOSYSTEM } from '@/lib/ecosystem';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-[var(--color-border)] mt-24">
      <div className="container-app py-10 space-y-8">
        {/* Ecosystem grid */}
        <div>
          <div className="text-[10px] uppercase tracking-widest text-[var(--color-text-dim)] mb-3">
            // deveco ecosystem
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {ECOSYSTEM.map(app => (
              <a
                key={app.slug}
                href={app.url}
                target={app.slug === 'folio' ? '_self' : '_blank'}
                rel="noreferrer"
                className="flex flex-col gap-0.5 px-3 py-2 rounded border border-[var(--color-border)] hover:border-opacity-60 transition-all group"
                style={{ '--hover-color': app.color } as React.CSSProperties}
              >
                <span className="text-[11px] font-semibold text-[var(--color-text-muted)] group-hover:text-[var(--color-text)] transition-colors">
                  {app.icon} {app.name}
                </span>
                <span className="text-[10px] text-[var(--color-text-dim)]">{app.desc}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4 border-t border-[var(--color-border)]">
          <div className="text-xs text-[var(--color-text-dim)]">
            <span className="text-[var(--color-neon-green)]">$</span>{' '}
            echo &quot;built by devs, for devs&quot;{' '}
            <span className="ml-2 text-[var(--color-text-dim)]">// deveco — 10 apps, 1 ecosystem</span>
          </div>
          <div className="flex items-center gap-3 text-[var(--color-text-muted)]">
            <a href={`https://github.com/${DEFAULT_GITHUB_USERNAME}`} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-[var(--color-neon-cyan)] transition-colors">
              <RiGithubFill size={18} />
            </a>
            <a href="#" aria-label="X" className="hover:text-[var(--color-neon-cyan)] transition-colors"><RiTwitterXFill size={16} /></a>
            <a href="#" aria-label="LinkedIn" className="hover:text-[var(--color-neon-cyan)] transition-colors"><RiLinkedinFill size={18} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

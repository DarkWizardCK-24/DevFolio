import Link from 'next/link';
import ProfileSearch from '@/components/ui/ProfileSearch';

export default function NotFound() {
  return (
    <div className="container-app py-20 max-w-2xl">
      <div className="term-card glow-cyan">
        <div className="term-card-header">
          <span className="text-[var(--color-neon-red)]">/dev/null</span>
          <span className="text-[var(--color-text-dim)]">exit 404</span>
        </div>
        <div className="term-card-body space-y-4">
          <div className="font-mono text-sm space-y-1.5">
            <div>
              <span className="text-[var(--color-neon-green)]">$</span> cat ./this-page
            </div>
            <div className="text-[var(--color-neon-red)]">
              cat: No such file or directory
            </div>
            <div className="text-[var(--color-text-muted)]">
              // That GitHub username may not exist, or was spelled incorrectly.
            </div>
          </div>

          {/* Search for a different profile */}
          <div className="pt-2 border-t border-[var(--color-border)]">
            <p className="text-[10px] uppercase tracking-widest text-[var(--color-text-dim)] mb-3">
              // try another username
            </p>
            <ProfileSearch placeholder="github-username" autoFocus />
          </div>

          <div className="pt-1 text-xs">
            <Link
              href="/"
              className="text-[var(--color-neon-cyan)] hover:underline"
            >
              ↩ cd ~/home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

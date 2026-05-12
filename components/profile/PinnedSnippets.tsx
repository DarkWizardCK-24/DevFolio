import { RiCodeSSlashLine, RiArrowRightSLine } from 'react-icons/ri';
import TerminalCard from '@/components/ui/TerminalCard';
import type { ProfileData } from '@/lib/profile';

const langColor: Record<string, string> = {
  yaml: 'var(--color-neon-amber)',
  sql: 'var(--color-neon-blue)',
  dart: 'var(--color-neon-cyan)',
  ts: 'var(--color-neon-blue)',
  js: 'var(--color-neon-amber)',
  py: 'var(--color-neon-green)',
};

export default function PinnedSnippets({ profile }: { profile: ProfileData }) {
  return (
    <TerminalCard title="$ ls ~/snippets/pinned" subtitle="codeshare.sh" glow="purple">
      <div className="space-y-2">
        {profile.pinnedSnippets.map((s) => (
          <a
            key={s.id}
            href="#"
            className="block border border-[var(--color-border)] rounded p-4 hover:border-[var(--color-neon-purple)] hover:bg-[rgba(138,91,255,0.04)] transition-colors group"
          >
            <div className="flex items-start gap-3">
              <RiCodeSSlashLine
                size={18}
                style={{ color: langColor[s.language] ?? 'var(--color-neon-cyan)' }}
                className="mt-0.5 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-semibold text-[var(--color-text)] truncate">
                    {s.title}
                  </div>
                  <span
                    className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border"
                    style={{
                      color: langColor[s.language] ?? 'var(--color-neon-cyan)',
                      borderColor: 'currentColor',
                    }}
                  >
                    {s.language}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[var(--color-text-muted)] line-clamp-2">
                  {s.description}
                </p>
                <div className="mt-1.5 text-[10px] text-[var(--color-text-dim)]">
                  {s.lines} lines · /snippets/{s.id}
                </div>
              </div>
              <RiArrowRightSLine
                className="text-[var(--color-text-dim)] group-hover:text-[var(--color-neon-purple)] group-hover:translate-x-1 transition-all"
                size={18}
              />
            </div>
          </a>
        ))}
      </div>
    </TerminalCard>
  );
}

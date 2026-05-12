import { RiStarLine, RiGitForkLine, RiGitRepositoryLine } from 'react-icons/ri';
import TerminalCard from '@/components/ui/TerminalCard';
import type { ProfileData } from '@/lib/profile';

const LANG_COLORS: Record<string, string> = {
  Dart: '#00E5FF',
  TypeScript: '#4D8CFF',
  JavaScript: '#FFB547',
  Python: '#00FFA3',
  HTML: '#FF6B6B',
  CSS: '#8A5BFF',
  Go: '#00ADD8',
  Java: '#F89820',
  Kotlin: '#7F52FF',
  Swift: '#F05138',
  Rust: '#FF7043',
  Ruby: '#CC342D',
  PHP: '#777BB4',
  Shell: '#89E051',
  C: '#A8B9CC',
  'C++': '#F34B7D',
  'C#': '#178600',
};

export default function PinnedRepos({ profile }: { profile: ProfileData }) {
  return (
    <TerminalCard title="$ git remote -v" subtitle="pinned repos" glow="cyan">
      <div className="grid sm:grid-cols-2 gap-3">
        {profile.pinnedRepos.map((r) => (
          <a
            key={r.name}
            href={`https://github.com/${profile.githubUsername}/${r.name}`}
            target="_blank"
            rel="noreferrer"
            className="border border-[var(--color-border)] rounded p-4 hover:border-[var(--color-neon-cyan)] hover:bg-[rgba(0,229,255,0.04)] transition-colors block"
          >
            <div className="flex items-center gap-2">
              <RiGitRepositoryLine className="text-[var(--color-neon-cyan)]" size={16} />
              <span className="text-sm font-semibold text-[var(--color-text)]">
                {r.name}
              </span>
            </div>
            {r.description && (
              <p className="mt-2 text-xs text-[var(--color-text-muted)] leading-relaxed line-clamp-2">
                {r.description}
              </p>
            )}
            <div className="mt-3 flex items-center gap-4 text-[11px] text-[var(--color-text-muted)]">
              {r.language && (
                <span className="flex items-center gap-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: LANG_COLORS[r.language] ?? '#8A5BFF' }}
                  />
                  {r.language}
                </span>
              )}
              <span className="flex items-center gap-1">
                <RiStarLine size={12} />
                {r.stars}
              </span>
              <span className="flex items-center gap-1">
                <RiGitForkLine size={12} />
                {r.forks}
              </span>
            </div>
          </a>
        ))}
      </div>
    </TerminalCard>
  );
}

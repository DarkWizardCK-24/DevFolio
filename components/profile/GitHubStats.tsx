import {
  RiGitRepositoryLine,
  RiUserFollowLine,
  RiUserHeartLine,
  RiFireLine,
  RiTrophyLine,
  RiGitBranchLine,
} from 'react-icons/ri';
import StatTile from '@/components/ui/StatTile';
import TerminalCard from '@/components/ui/TerminalCard';
import type { ProfileData } from '@/lib/profile';

export default function GitHubStats({ profile }: { profile: ProfileData }) {
  const { github } = profile;
  const hasContribStats = github.totalContribs > 0 || github.currentStreak > 0 || github.longestStreak > 0;
  const tileCols = hasContribStats ? 'lg:grid-cols-5' : 'lg:grid-cols-3';
  const hasLanguages = github.languages.length > 0;

  return (
    <TerminalCard title="$ git stats" subtitle="github.com" glow="cyan">
      <div className={`grid grid-cols-2 ${tileCols} gap-3`}>
        <StatTile icon={RiGitRepositoryLine} label="Repos" value={github.publicRepos} accent="cyan" />
        <StatTile icon={RiUserFollowLine} label="Followers" value={github.followers} accent="cyan" />
        <StatTile icon={RiUserHeartLine} label="Following" value={github.following} accent="cyan" />
        {hasContribStats && (
          <>
            <StatTile icon={RiGitBranchLine} label="Contribs" value={github.totalContribs} accent="green" />
            <StatTile icon={RiFireLine} label="Streak" value={`${github.currentStreak}d`} accent="amber" />
            <StatTile icon={RiTrophyLine} label="Best" value={`${github.longestStreak}d`} accent="purple" />
          </>
        )}
      </div>

      {hasLanguages && (
        <div className="mt-6">
          <div className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] mb-3">
            // language breakdown
          </div>
          <div className="flex h-2 rounded-full overflow-hidden border border-[var(--color-border)]">
            {github.languages.map((l) => (
              <div
                key={l.name}
                style={{ width: `${l.pct}%`, background: l.color }}
                title={`${l.name} ${l.pct}%`}
              />
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
            {github.languages.map((l) => (
              <div key={l.name} className="flex items-center gap-1.5 text-xs">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: l.color }}
                />
                <span className="text-[var(--color-text)]">{l.name}</span>
                <span className="text-[var(--color-text-dim)]">{l.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </TerminalCard>
  );
}

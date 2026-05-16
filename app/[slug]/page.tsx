import { notFound } from 'next/navigation';
import { getProfileData } from '@/lib/profile';
import ProfileHeader from '@/components/profile/ProfileHeader';
import GitHubStats from '@/components/profile/GitHubStats';
import LearningStreaks from '@/components/profile/LearningStreaks';
import PinnedSnippets from '@/components/profile/PinnedSnippets';
import PinnedRepos from '@/components/profile/PinnedRepos';
import ProfileSearch from '@/components/ui/ProfileSearch';
import { RiArrowRightLine, RiGithubFill, RiTerminalBoxLine } from 'react-icons/ri';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ECOSYSTEM } from '@/lib/ecosystem';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getProfileData(slug);
  if (!profile) {
    return {
      title: 'Profile not found — DevFolio',
      description: `No GitHub user matched @${slug}.`,
    };
  }
  return {
    title: `${profile.displayName} (@${profile.handle}) — DevFolio`,
    description:
      profile.bio ||
      `Public developer profile for @${profile.handle} — GitHub activity, repos, and language breakdown.`,
  };
}

export default async function ProfilePage({ params }: Props) {
  const { slug } = await params;
  if (!slug) notFound();

  const profile = await getProfileData(slug);
  if (!profile) notFound();

  const showLearning = profile.learning.targetDays > 0;
  const showSnippets = profile.pinnedSnippets.length > 0;
  const showRepos = profile.pinnedRepos.length > 0;

  return (
    <div className="container-app py-10 space-y-6">
      {/* breadcrumb */}
      <div className="text-xs text-[var(--color-text-muted)] flex items-center gap-2">
        <span className="text-[var(--color-neon-green)]">$</span>
        <span>cd ~/profiles/</span>
        <span className="text-[var(--color-neon-cyan)]">{profile.handle}</span>
      </div>

      <ProfileHeader profile={profile} />

      <div className={showLearning ? 'grid gap-6 lg:grid-cols-2' : ''}>
        <GitHubStats profile={profile} />
        {showLearning && <LearningStreaks profile={profile} />}
      </div>

      {showRepos && <PinnedRepos profile={profile} />}
      {showSnippets && <PinnedSnippets profile={profile} />}

      {/* CTA for visitors viewing another dev's profile */}
      {!profile.isOwner && (
        <div className="term-card glow-green">
          <div className="term-card-header">
            <span className="text-[var(--color-neon-green)]">$ devfolio --create</span>
            <span className="text-[var(--color-text-dim)]">free</span>
          </div>
          <div className="term-card-body">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex-1">
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  Like what you see? Build your own terminal-styled developer portfolio —
                  live GitHub data, learning streaks, pinned snippets.{' '}
                  <span className="text-[var(--color-neon-green)]">Free, open source.</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <Link
                  href="/dashboard"
                  className="group inline-flex items-center gap-2 px-4 py-2 text-sm rounded border border-[var(--color-neon-green)] bg-[rgba(0,255,163,0.06)] text-[var(--color-neon-green)] hover:bg-[rgba(0,255,163,0.14)] transition-colors"
                >
                  <RiTerminalBoxLine size={15} />
                  create mine
                  <RiArrowRightLine className="group-hover:translate-x-0.5 transition-transform" size={14} />
                </Link>
                <a
                  href="https://github.com/DarkWizardCK-24/devfolio"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-neon-green)] hover:text-[var(--color-neon-green)] transition-colors"
                >
                  <RiGithubFill size={15} />
                  source
                </a>
              </div>
            </div>

            {/* Quick lookup */}
            <div className="mt-6 pt-5 border-t border-[var(--color-border)]">
              <p className="text-[10px] uppercase tracking-widest text-[var(--color-text-dim)] mb-3">
                // look up another dev
              </p>
              <ProfileSearch placeholder="github-username" />
            </div>
          </div>
        </div>
      )}

      {/* Owner — ecosystem quick-launch */}
      {profile.isOwner && (
        <div className="term-card">
          <div className="term-card-header">
            <span className="text-[var(--color-neon-green)]">$ ls ~/deveco/apps/</span>
            <span className="text-[var(--color-text-dim)] text-[10px]">10 apps running</span>
          </div>
          <div className="term-card-body">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {ECOSYSTEM.filter(a => a.slug !== 'folio').map(app => (
                <a
                  key={app.slug}
                  href={app.url}
                  className="flex flex-col gap-1 p-2.5 rounded border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition-all group"
                >
                  <span className="text-base">{app.icon}</span>
                  <span className="text-[11px] font-semibold group-hover:underline transition-colors" style={{ color: app.color }}>
                    {app.name}
                  </span>
                  <span className="text-[10px] text-[var(--color-text-dim)] leading-tight">{app.desc}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* footer prompt */}
      <div className="pt-4 text-xs text-[var(--color-text-dim)]">
        <span className="text-[var(--color-neon-green)]">$</span> exit{' '}
        <span className="caret"></span>
      </div>
    </div>
  );
}

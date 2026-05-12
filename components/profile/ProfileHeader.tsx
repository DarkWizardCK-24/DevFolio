import Image from 'next/image';
import {
  RiGithubFill,
  RiMapPin2Line,
  RiMailLine,
  RiCircleFill,
  RiLink,
} from 'react-icons/ri';
import ShareButton from '@/components/ui/ShareButton';
import type { ProfileData } from '@/lib/profile';

function displayDomain(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

export default function ProfileHeader({ profile }: { profile: ProfileData }) {
  return (
    <div className="term-card glow-cyan">
      <div className="term-card-header">
        <span className="text-[var(--color-neon-cyan)]">/etc/profile</span>
        <div className="flex items-center gap-2">
          <span className="text-[var(--color-text-dim)]">@{profile.handle}</span>
          <ShareButton handle={profile.handle} />
        </div>
      </div>
      <div className="term-card-body">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="relative shrink-0">
            <Image
              src={profile.avatarUrl}
              alt={profile.displayName}
              width={96}
              height={96}
              className="rounded-md border-2 border-[var(--color-neon-cyan)]"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[var(--color-neon-green)] rounded-full border-2 border-[var(--color-bg)]" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h1 className="text-2xl font-bold text-[var(--color-text)]">
                {profile.displayName}
              </h1>
              <span className="text-[var(--color-neon-cyan)]">@{profile.handle}</span>
            </div>
            {profile.bio && (
              <p className="mt-2 text-[var(--color-text-muted)] leading-relaxed">
                {profile.bio}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[var(--color-text-muted)]">
              {profile.location && (
                <span className="flex items-center gap-1.5">
                  <RiMapPin2Line size={14} className="text-[var(--color-neon-blue)]" />
                  {profile.location}
                </span>
              )}
              <a
                href={`https://github.com/${profile.githubUsername}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-[var(--color-neon-cyan)] transition-colors"
              >
                <RiGithubFill size={14} />
                {profile.githubUsername}
              </a>
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-[var(--color-neon-cyan)] transition-colors"
                >
                  <RiLink size={14} className="text-[var(--color-neon-green)]" />
                  {displayDomain(profile.website)}
                </a>
              )}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-1.5 hover:text-[var(--color-neon-cyan)] transition-colors"
                >
                  <RiMailLine size={14} className="text-[var(--color-neon-purple)]" />
                  {profile.email}
                </a>
              )}
              {profile.status && (
                <span className="flex items-center gap-1.5 text-[var(--color-neon-green)]">
                  <RiCircleFill size={8} />
                  {profile.status}
                </span>
              )}
            </div>

            {profile.tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {profile.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-0.5 text-[11px] rounded border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-neon-cyan)] hover:border-[var(--color-neon-cyan)] transition-colors"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

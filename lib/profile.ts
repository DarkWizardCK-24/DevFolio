import { fetchGithubUser, fetchGithubRepos, aggregateLanguages, topRepos } from './github';
import { createClient as createServerClient } from './supabase-server';
import type { ProfileData } from './mockData';

export type { ProfileData };

const SLUG_PATTERN = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

export function isValidSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug);
}

export async function getProfileData(slug: string): Promise<ProfileData | null> {
  if (!isValidSlug(slug)) return null;

  const [user, repos, sb] = await Promise.all([
    fetchGithubUser(slug),
    fetchGithubRepos(slug),
    createServerClient(),
  ]);

  if (!user) return null;

  const { data: { user: authUser } } = await sb.auth.getUser();
  const isOwner =
    !!authUser &&
    authUser.user_metadata?.user_name?.toLowerCase() === slug.toLowerCase();

  const languages = aggregateLanguages(repos);
  const pinnedRepos = topRepos(repos, 6);

  let personal: {
    email: string;
    status: string;
    tags: string[];
    learning: ProfileData['learning'];
    pinnedSnippets: ProfileData['pinnedSnippets'];
    github: { totalContribs: number; currentStreak: number; longestStreak: number };
  };

  if (isOwner) {
    try {
      const { data: supaProfile } = await sb
        .from('profiles')
        .select('*')
        .eq('username', slug)
        .single();

      const [{ data: snippets }, { data: goals }] = await Promise.all([
        supaProfile
          ? sb.from('snippets').select('*').eq('user_id', supaProfile.id).eq('pinned', true).order('created_at', { ascending: false })
          : Promise.resolve({ data: [] }),
        supaProfile
          ? sb.from('learning_goals').select('*').eq('user_id', supaProfile.id).order('created_at', { ascending: false }).limit(1)
          : Promise.resolve({ data: [] }),
      ]);

      const activeGoal = goals?.[0];
      personal = {
        email: user.email ?? authUser.email ?? '',
        status: supaProfile?.status ?? '',
        tags: supaProfile?.tags?.length ? supaProfile.tags : languages.slice(0, 6).map(l => l.name),
        learning: activeGoal
          ? {
              goal: activeGoal.goal,
              targetDays: activeGoal.target_days,
              elapsedDays: activeGoal.elapsed_days,
              completionPct: Math.round((activeGoal.elapsed_days / activeGoal.target_days) * 100),
              currentStreak: 0,
            }
          : { goal: '', targetDays: 0, elapsedDays: 0, completionPct: 0, currentStreak: 0 },
        pinnedSnippets: (snippets ?? []).map(s => ({
          id: s.id,
          title: s.title,
          language: s.language,
          description: s.description,
          lines: s.code.split('\n').length,
        })),
        github: { totalContribs: 0, currentStreak: 0, longestStreak: 0 },
      };
    } catch {
      personal = {
        email: user.email ?? '',
        status: '',
        tags: languages.slice(0, 6).map(l => l.name),
        learning: { goal: '', targetDays: 0, elapsedDays: 0, completionPct: 0, currentStreak: 0 },
        pinnedSnippets: [],
        github: { totalContribs: 0, currentStreak: 0, longestStreak: 0 },
      };
    }
  } else {
    personal = {
      email: user.email ?? '',
      status: '',
      tags: languages.slice(0, 5).map(l => l.name),
      learning: { goal: '', targetDays: 0, elapsedDays: 0, completionPct: 0, currentStreak: 0 },
      pinnedSnippets: [],
      github: { totalContribs: 0, currentStreak: 0, longestStreak: 0 },
    };
  }

  const rawBlog = user.blog ?? '';
  const website = rawBlog ? (rawBlog.startsWith('http') ? rawBlog : `https://${rawBlog}`) : '';

  return {
    slug,
    isOwner,
    handle: user.login,
    displayName: user.name ?? user.login,
    bio: user.bio ?? '',
    location: user.location ?? '',
    website,
    avatarUrl: user.avatar_url,
    githubUsername: user.login,
    email: personal.email,
    status: personal.status,
    tags: personal.tags,
    github: {
      publicRepos: user.public_repos,
      followers: user.followers,
      following: user.following,
      totalContribs: personal.github.totalContribs,
      currentStreak: personal.github.currentStreak,
      longestStreak: personal.github.longestStreak,
      languages,
    },
    learning: personal.learning,
    pinnedSnippets: personal.pinnedSnippets,
    pinnedRepos,
  };
}

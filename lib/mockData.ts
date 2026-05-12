// Mock data for the public profile route until Supabase is wired.

import { DEFAULT_GITHUB_USERNAME, DEFAULT_HANDLE } from './config';

export type ProfileData = {
  slug: string;
  isOwner: boolean;
  displayName: string;
  handle: string;
  bio: string;
  location: string;
  website: string;
  avatarUrl: string;
  githubUsername: string;
  email: string;
  status: string;
  tags: string[];
  github: {
    publicRepos: number;
    followers: number;
    following: number;
    totalContribs: number;
    currentStreak: number;
    longestStreak: number;
    languages: { name: string; pct: number; color: string }[];
  };
  learning: {
    goal: string;
    targetDays: number;
    elapsedDays: number;
    completionPct: number;
    currentStreak: number;
  };
  pinnedSnippets: {
    id: string;
    title: string;
    language: string;
    description: string;
    lines: number;
  }[];
  pinnedRepos: {
    name: string;
    description: string;
    stars: number;
    forks: number;
    language: string;
  }[];
};

export const mockProfile: ProfileData = {
  slug: DEFAULT_HANDLE,
  isOwner: true,
  displayName: DEFAULT_GITHUB_USERNAME,
  handle: DEFAULT_HANDLE,
  bio: 'Full-stack dev building a developer-tools ecosystem. Flutter + Next.js. Living in the terminal.',
  location: 'India',
  website: '',
  avatarUrl: `https://github.com/${DEFAULT_GITHUB_USERNAME}.png`,
  githubUsername: DEFAULT_GITHUB_USERNAME,
  email: 'katarechaitanya24@gmail.com',
  status: 'Available for collab',
  tags: ['Flutter', 'Next.js', 'Supabase', 'Postgres', 'TypeScript', 'Dart'],
  github: {
    publicRepos: 42,
    followers: 128,
    following: 64,
    totalContribs: 1247,
    currentStreak: 12,
    longestStreak: 47,
    languages: [
      { name: 'Dart', pct: 38, color: '#00E5FF' },
      { name: 'TypeScript', pct: 27, color: '#4D8CFF' },
      { name: 'JavaScript', pct: 18, color: '#FFB547' },
      { name: 'Python', pct: 10, color: '#00FFA3' },
      { name: 'Other', pct: 7, color: '#8A5BFF' },
    ],
  },
  learning: {
    goal: 'Linux + DevOps Mastery',
    targetDays: 120,
    elapsedDays: 47,
    completionPct: 39,
    currentStreak: 12,
  },
  pinnedSnippets: [
    {
      id: 'snip_01',
      title: 'k8s rolling deploy',
      language: 'yaml',
      description: 'Zero-downtime rolling deploy template with health probes.',
      lines: 38,
    },
    {
      id: 'snip_02',
      title: 'Supabase RLS policies',
      language: 'sql',
      description: 'Row-level security for multi-tenant tables.',
      lines: 24,
    },
    {
      id: 'snip_03',
      title: 'Flutter responsive scaffold',
      language: 'dart',
      description: 'Adaptive layout helper — phone / tablet / desktop.',
      lines: 67,
    },
  ],
  pinnedRepos: [
    {
      name: 'devops-training',
      description: 'Learning Tracker — track your learning + GitHub activity.',
      stars: 12,
      forks: 2,
      language: 'Dart',
    },
    {
      name: 'github-visualizer',
      description: 'Flutter app visualizing GitHub profiles, repos, and contributions.',
      stars: 8,
      forks: 1,
      language: 'Dart',
    },
    {
      name: 'devpulse',
      description: 'GitHub repo analyzer + REST API playground.',
      stars: 15,
      forks: 3,
      language: 'TypeScript',
    },
  ],
};

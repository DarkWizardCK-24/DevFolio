export type GhUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  blog: string | null;
  twitter_username: string | null;
  email: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
};

export type GhRepo = {
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  fork: boolean;
  archived: boolean;
  html_url: string;
  pushed_at: string;
};

export type LanguageSlice = { name: string; pct: number; color: string };

const GH_API = 'https://api.github.com';
const REVALIDATE_SECONDS = 3600;

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

function ghHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

export async function fetchGithubUser(username: string): Promise<GhUser | null> {
  try {
    const res = await fetch(`${GH_API}/users/${encodeURIComponent(username)}`, {
      headers: ghHeaders(),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    return (await res.json()) as GhUser;
  } catch {
    return null;
  }
}

export async function fetchGithubRepos(username: string): Promise<GhRepo[]> {
  try {
    const res = await fetch(
      `${GH_API}/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
      {
        headers: ghHeaders(),
        next: { revalidate: REVALIDATE_SECONDS },
      },
    );
    if (!res.ok) return [];
    return (await res.json()) as GhRepo[];
  } catch {
    return [];
  }
}

export function aggregateLanguages(repos: GhRepo[]): LanguageSlice[] {
  const counts: Record<string, number> = {};
  for (const r of repos) {
    if (r.fork || r.archived || !r.language) continue;
    counts[r.language] = (counts[r.language] ?? 0) + 1;
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (total === 0) return [];

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, 4).map(([name, n]) => ({
    name,
    pct: Math.round((n / total) * 100),
    color: LANG_COLORS[name] ?? '#8A5BFF',
  }));

  const otherPct = 100 - top.reduce((s, t) => s + t.pct, 0);
  if (otherPct > 0 && sorted.length > 4) {
    top.push({ name: 'Other', pct: otherPct, color: '#8A5BFF' });
  }
  return top;
}

export function topRepos(repos: GhRepo[], n = 6) {
  return repos
    .filter((r) => !r.fork && !r.archived)
    .sort(
      (a, b) =>
        b.stargazers_count - a.stargazers_count ||
        +new Date(b.pushed_at) - +new Date(a.pushed_at),
    )
    .slice(0, n)
    .map((r) => ({
      name: r.name,
      description: r.description ?? '',
      stars: r.stargazers_count,
      forks: r.forks_count,
      language: r.language ?? 'Other',
    }));
}

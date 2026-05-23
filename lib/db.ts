import { createClient } from './supabase';

// ============================================================
// TYPES
// ============================================================

export type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  bio: string;
  location: string;
  website: string;
  status: string;
  tags: string[];
  avatar_url: string | null;
  github_username: string | null;
  created_at: string;
  updated_at: string;
};

export type Snippet = {
  id: string;
  user_id: string;
  title: string;
  language: string;
  code: string;
  description: string;
  pinned: boolean;
  created_at: string;
  updated_at: string;
};

export type LearningGoal = {
  id: string;
  user_id: string;
  goal: string;
  target_days: number;
  elapsed_days: number;
  started_at: string;
  created_at: string;
};

export type Note = {
  id: string;
  user_id: string;
  title: string;
  content_md: string;
  tags: string[];
  created_at: string;
  updated_at: string;
};

export type TimerSession = {
  id: string;
  user_id: string;
  duration_secs: number;
  mode: 'work' | 'break' | 'long_break';
  label: string | null;
  completed_at: string;
};

export type TimerStats = {
  totalSessions: number;
  totalWorkSecs: number;
  totalBreakSecs: number;
  todaySessions: number;
  todayWorkSecs: number;
};

export type CalendarEvent = {
  id: string;
  user_id: string;
  title: string;
  date: string;
  time: string | null;
  type: 'task' | 'meeting' | 'deadline' | 'reminder';
  done: boolean;
  note: string | null;
  created_at: string;
};

export type CalendarGoal = {
  id: string;
  user_id: string;
  title: string;
  deadline: string;
  progress: number;
  color: string;
  created_at: string;
  updated_at: string;
};

export type RoadmapProgress = {
  id: string;
  user_id: string;
  track_id: string;
  skill_id: string;
  completed_at: string;
};

export type BlogPost = {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  content_md: string;
  excerpt: string;
  cover_url: string | null;
  tags: string[];
  published: boolean;
  published_at: string | null;
  views: number;
  read_time: number;
  created_at: string;
  updated_at: string;
  author?: { username: string; display_name: string | null; avatar_url: string | null };
};

export type BlogComment = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author?: { username: string; display_name: string | null; avatar_url: string | null };
};

export type StatusService = {
  name: string;
  url: string;
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  latency?: number;
};

export type StatusPage = {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  services: StatusService[];
  created_at: string;
  updated_at: string;
};

export type Incident = {
  id: string;
  status_page_id: string;
  title: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  severity: 'minor' | 'major' | 'critical';
  updates: Array<{ time: string; message: string }>;
  created_at: string;
  resolved_at: string | null;
};

export type EnvVar = { key: string; value: string; masked: boolean };

export type EnvProject = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  vars: EnvVar[];
  created_at: string;
  updated_at: string;
};

export type ApkApp = {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  description: string;
  package_name: string;
  icon_url: string | null;
  category: 'utility' | 'game' | 'productivity' | 'social' | 'media' | 'finance' | 'education' | 'other';
  tags: string[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

export type ApkBuild = {
  id: string;
  app_id: string;
  user_id: string;
  version_name: string;
  version_code: number;
  file_url: string;
  file_name: string;
  file_size: number;
  build_type: 'debug' | 'release';
  changelog: string;
  min_sdk: number;
  target_sdk: number;
  permissions: string[];
  download_count: number;
  sha256: string;
  created_at: string;
};

export type CodeSnippet = {
  id: string;
  user_id: string;
  title: string;
  filename: string;
  language: string;
  code: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

// ============================================================
// PROFILE
// ============================================================

export async function getProfile(username: string): Promise<Profile | null> {
  const sb = createClient();
  const { data } = await sb.from('profiles').select('*').eq('username', username).single();
  return data ?? null;
}

export async function getMyProfile(): Promise<Profile | null> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;
  const { data } = await sb.from('profiles').select('*').eq('id', user.id).single();
  return data ?? null;
}

export async function updateProfile(
  patch: Partial<Pick<Profile, 'display_name' | 'bio' | 'location' | 'website' | 'status' | 'tags' | 'avatar_url'>>
): Promise<void> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;
  await sb.from('profiles').update(patch).eq('id', user.id);
}

// ============================================================
// SNIPPETS
// ============================================================

export async function getPinnedSnippets(username: string): Promise<Snippet[]> {
  const sb = createClient();
  const { data: profile } = await sb.from('profiles').select('id').eq('username', username).single();
  if (!profile) return [];
  const { data } = await sb
    .from('snippets')
    .select('*')
    .eq('user_id', profile.id)
    .eq('pinned', true)
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function getMySnippets(): Promise<Snippet[]> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return [];
  const { data } = await sb
    .from('snippets')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function createSnippet(
  title: string,
  language: string,
  code: string,
  description: string,
  pinned = false
): Promise<Snippet> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data, error } = await sb
    .from('snippets')
    .insert({ user_id: user.id, title, language, code, description, pinned })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateSnippet(
  id: string,
  patch: Partial<Pick<Snippet, 'title' | 'language' | 'code' | 'description' | 'pinned'>>
): Promise<void> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;
  await sb.from('snippets').update(patch).eq('id', id).eq('user_id', user.id);
}

export async function deleteSnippet(id: string): Promise<void> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;
  await sb.from('snippets').delete().eq('id', id).eq('user_id', user.id);
}

// ============================================================
// LEARNING GOALS
// ============================================================

export async function getLearningGoals(): Promise<LearningGoal[]> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return [];
  const { data } = await sb
    .from('learning_goals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function createLearningGoal(goal: string, target_days: number): Promise<LearningGoal> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data, error } = await sb
    .from('learning_goals')
    .insert({ user_id: user.id, goal, target_days })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateLearningGoal(
  id: string,
  patch: Partial<Pick<LearningGoal, 'goal' | 'target_days' | 'elapsed_days'>>
): Promise<void> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;
  await sb.from('learning_goals').update(patch).eq('id', id).eq('user_id', user.id);
}

export async function deleteLearningGoal(id: string): Promise<void> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;
  await sb.from('learning_goals').delete().eq('id', id).eq('user_id', user.id);
}

// ============================================================
// GITHUB CACHE
// ============================================================

export type GithubCacheEntry = {
  username: string;
  data: Record<string, unknown>;
  fetched_at: string;
};

export async function getCachedGithub(username: string): Promise<GithubCacheEntry | null> {
  const sb = createClient();
  const { data } = await sb.from('github_cache').select('*').eq('username', username).single();
  return data ?? null;
}

export function isCacheStale(entry: GithubCacheEntry, ttlSeconds = 3600): boolean {
  return Date.now() - new Date(entry.fetched_at).getTime() > ttlSeconds * 1000;
}

export async function setCachedGithub(username: string, data: Record<string, unknown>): Promise<void> {
  const sb = createClient();
  await sb
    .from('github_cache')
    .upsert({ username, data, fetched_at: new Date().toISOString() })
    .eq('username', username);
}

// ============================================================
// NOTES
// ============================================================

export async function getNotes(): Promise<Note[]> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return [];
  const { data } = await sb
    .from('notes')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });
  return data ?? [];
}

export async function createNote(title: string, content_md: string, tags: string[]): Promise<Note> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data, error } = await sb
    .from('notes')
    .insert({ user_id: user.id, title, content_md, tags })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateNote(
  id: string,
  patch: Partial<Pick<Note, 'title' | 'content_md' | 'tags'>>
): Promise<void> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;
  await sb.from('notes').update(patch).eq('id', id).eq('user_id', user.id);
}

export async function deleteNote(id: string): Promise<void> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;
  await sb.from('notes').delete().eq('id', id).eq('user_id', user.id);
}

// ============================================================
// TIMER SESSIONS
// ============================================================

export async function getTimerSessions(limit = 50): Promise<TimerSession[]> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return [];
  const { data } = await sb
    .from('timer_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function createTimerSession(
  duration_secs: number,
  mode: TimerSession['mode'],
  label?: string
): Promise<TimerSession> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data, error } = await sb
    .from('timer_sessions')
    .insert({ user_id: user.id, duration_secs, mode, label: label ?? null })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getTimerStats(): Promise<TimerStats> {
  const sessions = await getTimerSessions(500);
  const today = new Date().toISOString().slice(0, 10);
  const todaySessions = sessions.filter(s => s.completed_at.startsWith(today));
  return {
    totalSessions:  sessions.filter(s => s.mode === 'work').length,
    totalWorkSecs:  sessions.filter(s => s.mode === 'work').reduce((a, s) => a + s.duration_secs, 0),
    totalBreakSecs: sessions.filter(s => s.mode !== 'work').reduce((a, s) => a + s.duration_secs, 0),
    todaySessions:  todaySessions.filter(s => s.mode === 'work').length,
    todayWorkSecs:  todaySessions.filter(s => s.mode === 'work').reduce((a, s) => a + s.duration_secs, 0),
  };
}

// ============================================================
// CALENDAR EVENTS
// ============================================================

export async function getCalendarEvents(year: number, month: number): Promise<CalendarEvent[]> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return [];
  const pad = (n: number) => String(n).padStart(2, '0');
  const from = `${year}-${pad(month)}-01`;
  const to   = `${year}-${pad(month)}-31`;
  const { data } = await sb
    .from('calendar_events')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', from)
    .lte('date', to)
    .order('date', { ascending: true });
  return data ?? [];
}

export async function createCalendarEvent(
  title: string,
  date: string,
  type: CalendarEvent['type'],
  time?: string,
  note?: string
): Promise<CalendarEvent> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data, error } = await sb
    .from('calendar_events')
    .insert({ user_id: user.id, title, date, type, time: time ?? null, note: note ?? null })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCalendarEvent(
  id: string,
  patch: Partial<Pick<CalendarEvent, 'title' | 'date' | 'time' | 'type' | 'done' | 'note'>>
): Promise<void> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;
  await sb.from('calendar_events').update(patch).eq('id', id).eq('user_id', user.id);
}

export async function deleteCalendarEvent(id: string): Promise<void> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;
  await sb.from('calendar_events').delete().eq('id', id).eq('user_id', user.id);
}

// ============================================================
// CALENDAR GOALS
// ============================================================

export async function getCalendarGoals(): Promise<CalendarGoal[]> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return [];
  const { data } = await sb
    .from('calendar_goals')
    .select('*')
    .eq('user_id', user.id)
    .order('deadline', { ascending: true });
  return data ?? [];
}

export async function createCalendarGoal(
  title: string,
  deadline: string,
  color = '#ff6eb4'
): Promise<CalendarGoal> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data, error } = await sb
    .from('calendar_goals')
    .insert({ user_id: user.id, title, deadline, color, progress: 0 })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCalendarGoal(
  id: string,
  patch: Partial<Pick<CalendarGoal, 'title' | 'deadline' | 'progress' | 'color'>>
): Promise<void> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;
  await sb.from('calendar_goals').update(patch).eq('id', id).eq('user_id', user.id);
}

export async function deleteCalendarGoal(id: string): Promise<void> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;
  await sb.from('calendar_goals').delete().eq('id', id).eq('user_id', user.id);
}

// ============================================================
// ROADMAP PROGRESS
// ============================================================

export async function getRoadmapProgress(trackId?: string): Promise<RoadmapProgress[]> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return [];
  let q = sb.from('roadmap_progress').select('*').eq('user_id', user.id);
  if (trackId) q = q.eq('track_id', trackId);
  const { data } = await q.order('completed_at', { ascending: false });
  return data ?? [];
}

export async function markSkillComplete(trackId: string, skillId: string): Promise<void> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  await sb.from('roadmap_progress').upsert({ user_id: user.id, track_id: trackId, skill_id: skillId });
}

export async function unmarkSkillComplete(trackId: string, skillId: string): Promise<void> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  await sb
    .from('roadmap_progress')
    .delete()
    .eq('user_id', user.id)
    .eq('track_id', trackId)
    .eq('skill_id', skillId);
}

// ============================================================
// BLOG POSTS
// ============================================================

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const sb = createClient();
  const { data } = await sb
    .from('blog_posts')
    .select('*, author:profiles(username, display_name, avatar_url)')
    .eq('published', true)
    .order('published_at', { ascending: false });
  return data ?? [];
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const sb = createClient();
  const { data } = await sb
    .from('blog_posts')
    .select('*, author:profiles(username, display_name, avatar_url)')
    .eq('slug', slug)
    .eq('published', true)
    .single();
  return data ?? null;
}

export async function getBlogPostsByUser(username: string): Promise<BlogPost[]> {
  const sb = createClient();
  const { data: profile } = await sb.from('profiles').select('id').eq('username', username).single();
  if (!profile) return [];
  const { data: { user } } = await sb.auth.getUser();
  const isOwner = user?.id === profile.id;
  let q = sb
    .from('blog_posts')
    .select('*, author:profiles(username, display_name, avatar_url)')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false });
  if (!isOwner) q = q.eq('published', true);
  const { data } = await q;
  return data ?? [];
}

export async function getMyBlogPosts(): Promise<BlogPost[]> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return [];
  const { data } = await sb
    .from('blog_posts')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });
  return data ?? [];
}

export async function incrementPostViews(postId: string): Promise<void> {
  const sb = createClient();
  await sb.rpc('increment_post_views', { p_post_id: postId });
}

// ── Blog Likes ────────────────────────────────────────────────────────────────

export async function getBlogLikeCount(postId: string): Promise<number> {
  const sb = createClient();
  const { count } = await sb
    .from('blog_post_likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId);
  return count ?? 0;
}

export async function hasUserLikedPost(postId: string): Promise<boolean> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return false;
  const { data } = await sb
    .from('blog_post_likes')
    .select('post_id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .single();
  return !!data;
}

export async function toggleBlogLike(postId: string): Promise<{ liked: boolean; count: number }> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const liked = await hasUserLikedPost(postId);
  if (liked) {
    await sb.from('blog_post_likes').delete().eq('post_id', postId).eq('user_id', user.id);
  } else {
    await sb.from('blog_post_likes').insert({ post_id: postId, user_id: user.id });
  }
  const count = await getBlogLikeCount(postId);
  return { liked: !liked, count };
}

// ── Blog Comments ─────────────────────────────────────────────────────────────

export async function getBlogComments(postId: string): Promise<BlogComment[]> {
  const sb = createClient();
  const { data } = await sb
    .from('blog_comments')
    .select('*, author:profiles(username, display_name, avatar_url)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });
  return data ?? [];
}

export async function addBlogComment(postId: string, content: string): Promise<BlogComment> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data, error } = await sb
    .from('blog_comments')
    .insert({ post_id: postId, user_id: user.id, content })
    .select('*, author:profiles(username, display_name, avatar_url)')
    .single();
  if (error) throw error;
  return data;
}

export async function updateBlogComment(commentId: string, content: string): Promise<void> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;
  await sb.from('blog_comments').update({ content }).eq('id', commentId).eq('user_id', user.id);
}

export async function deleteBlogComment(commentId: string): Promise<void> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;
  await sb.from('blog_comments').delete().eq('id', commentId).eq('user_id', user.id);
}

// ── Blog Bookmarks ────────────────────────────────────────────────────────────

export async function hasBlogBookmark(postId: string): Promise<boolean> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return false;
  const { data } = await sb
    .from('blog_bookmarks')
    .select('post_id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .single();
  return !!data;
}

export async function toggleBlogBookmark(postId: string): Promise<boolean> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const bookmarked = await hasBlogBookmark(postId);
  if (bookmarked) {
    await sb.from('blog_bookmarks').delete().eq('post_id', postId).eq('user_id', user.id);
    return false;
  }
  await sb.from('blog_bookmarks').insert({ post_id: postId, user_id: user.id });
  return true;
}

export async function getBookmarkedBlogPosts(): Promise<BlogPost[]> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return [];
  const { data } = await sb
    .from('blog_bookmarks')
    .select('post_id, blog_posts(*, author:profiles(username, display_name, avatar_url))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((r: any) => r.blog_posts).filter(Boolean);
}

// ============================================================
// STATUS PAGES
// ============================================================

export async function getStatusPage(username: string): Promise<StatusPage | null> {
  const sb = createClient();
  const { data } = await sb.from('status_pages').select('*').eq('username', username).single();
  return data ?? null;
}

export async function getMyStatusPage(): Promise<StatusPage | null> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;
  const { data } = await sb.from('status_pages').select('*').eq('user_id', user.id).single();
  return data ?? null;
}

export async function createStatusPage(
  username: string,
  display_name: string,
  services: StatusService[]
): Promise<StatusPage> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data, error } = await sb
    .from('status_pages')
    .insert({ user_id: user.id, username, display_name, services })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateStatusPage(
  id: string,
  patch: Partial<Pick<StatusPage, 'display_name' | 'services'>>
): Promise<void> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;
  await sb.from('status_pages').update(patch).eq('id', id).eq('user_id', user.id);
}

// ── Incidents ─────────────────────────────────────────────────────────────────

export async function getIncidents(statusPageId: string): Promise<Incident[]> {
  const sb = createClient();
  const { data } = await sb
    .from('incidents')
    .select('*')
    .eq('status_page_id', statusPageId)
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function createIncident(
  statusPageId: string,
  title: string,
  severity: Incident['severity']
): Promise<Incident> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data, error } = await sb
    .from('incidents')
    .insert({
      status_page_id: statusPageId,
      title,
      severity,
      status: 'investigating',
      updates: [{ time: new Date().toISOString(), message: 'Incident created.' }],
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateIncidentStatus(
  id: string,
  status: Incident['status'],
  message: string
): Promise<void> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;
  const { data: existing } = await sb.from('incidents').select('updates').eq('id', id).single();
  const updates = [...(existing?.updates ?? []), { time: new Date().toISOString(), message }];
  const patch: Record<string, unknown> = { status, updates };
  if (status === 'resolved') patch.resolved_at = new Date().toISOString();
  await sb.from('incidents').update(patch).eq('id', id);
}

// ============================================================
// ENV VAULT
// ============================================================

export async function getEnvProjects(): Promise<EnvProject[]> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return [];
  const { data } = await sb
    .from('env_projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function createEnvProject(
  name: string,
  description?: string,
  vars: EnvVar[] = []
): Promise<EnvProject> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data, error } = await sb
    .from('env_projects')
    .insert({ user_id: user.id, name, description: description ?? null, vars })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateEnvProject(
  id: string,
  patch: Partial<Pick<EnvProject, 'name' | 'description' | 'vars'>>
): Promise<void> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;
  await sb.from('env_projects').update(patch).eq('id', id).eq('user_id', user.id);
}

export async function deleteEnvProject(id: string): Promise<void> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;
  await sb.from('env_projects').delete().eq('id', id).eq('user_id', user.id);
}

// ============================================================
// APK APPS
// ============================================================

export async function getPublicApkApps(category?: string): Promise<ApkApp[]> {
  const sb = createClient();
  let q = sb.from('apk_apps').select('*').eq('is_public', true).order('created_at', { ascending: false });
  if (category) q = q.eq('category', category);
  const { data } = await q;
  return data ?? [];
}

export async function getMyApkApps(): Promise<ApkApp[]> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return [];
  const { data } = await sb
    .from('apk_apps')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function getApkApp(slug: string): Promise<ApkApp | null> {
  const sb = createClient();
  const { data } = await sb.from('apk_apps').select('*').eq('slug', slug).single();
  return data ?? null;
}

export async function createApkApp(
  name: string,
  slug: string,
  package_name: string,
  category: ApkApp['category'],
  description = '',
  tags: string[] = [],
  is_public = true
): Promise<ApkApp> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data, error } = await sb
    .from('apk_apps')
    .insert({ user_id: user.id, name, slug, package_name, category, description, tags, is_public })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateApkApp(
  id: string,
  patch: Partial<Omit<ApkApp, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<void> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;
  await sb.from('apk_apps').update(patch).eq('id', id).eq('user_id', user.id);
}

export async function deleteApkApp(id: string): Promise<void> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;
  await sb.from('apk_apps').delete().eq('id', id).eq('user_id', user.id);
}

// ── APK Builds ────────────────────────────────────────────────────────────────

export async function getApkBuilds(appId: string): Promise<ApkBuild[]> {
  const sb = createClient();
  const { data } = await sb
    .from('apk_builds')
    .select('*')
    .eq('app_id', appId)
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function createApkBuild(
  appId: string,
  versionName: string,
  versionCode: number,
  fileUrl: string,
  fileName: string,
  fileSize: number,
  buildType: ApkBuild['build_type'] = 'release',
  opts: {
    changelog?: string;
    minSdk?: number;
    targetSdk?: number;
    permissions?: string[];
    sha256?: string;
  } = {}
): Promise<ApkBuild> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data, error } = await sb
    .from('apk_builds')
    .insert({
      app_id: appId,
      user_id: user.id,
      version_name: versionName,
      version_code: versionCode,
      file_url: fileUrl,
      file_name: fileName,
      file_size: fileSize,
      build_type: buildType,
      changelog:   opts.changelog   ?? '',
      min_sdk:     opts.minSdk      ?? 21,
      target_sdk:  opts.targetSdk   ?? 34,
      permissions: opts.permissions ?? [],
      sha256:      opts.sha256      ?? '',
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateApkBuild(
  id: string,
  patch: Partial<Pick<ApkBuild, 'changelog' | 'version_name' | 'min_sdk' | 'target_sdk' | 'permissions'>>
): Promise<void> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;
  await sb.from('apk_builds').update(patch).eq('id', id).eq('user_id', user.id);
}

export async function deleteApkBuild(id: string): Promise<void> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;
  await sb.from('apk_builds').delete().eq('id', id).eq('user_id', user.id);
}

export async function incrementApkDownload(buildId: string): Promise<void> {
  const sb = createClient();
  await sb.rpc('increment_apk_download', { build_id: buildId });
}

// ============================================================
// CODE SNIPPETS (DevShare)
// ============================================================

export async function getCodeSnippet(id: string): Promise<CodeSnippet | null> {
  const sb = createClient();
  const { data } = await sb.from('code_snippets').select('*').eq('id', id).single();
  return data ?? null;
}

export async function getMyCodeSnippets(): Promise<CodeSnippet[]> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return [];
  const { data } = await sb
    .from('code_snippets')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function createCodeSnippet(
  id: string,
  title: string,
  language: string,
  code: string,
  filename = '',
  notes = ''
): Promise<CodeSnippet> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data, error } = await sb
    .from('code_snippets')
    .insert({ id, user_id: user.id, title, language, code, filename, notes })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCodeSnippet(
  id: string,
  patch: Partial<Pick<CodeSnippet, 'title' | 'filename' | 'language' | 'code' | 'notes'>>
): Promise<void> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;
  await sb.from('code_snippets').update(patch).eq('id', id).eq('user_id', user.id);
}

export async function deleteCodeSnippet(id: string): Promise<void> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;
  await sb.from('code_snippets').delete().eq('id', id).eq('user_id', user.id);
}

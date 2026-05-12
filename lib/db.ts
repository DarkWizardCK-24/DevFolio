import { createClient } from './supabase';

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

// ─── Profile ────────────────────────────────────────────────────────────────

export async function getProfile(username: string): Promise<Profile | null> {
  const sb = createClient();
  const { data } = await sb.from('profiles').select('*').eq('username', username).single();
  return data ?? null;
}

export async function updateProfile(patch: Partial<Pick<Profile, 'display_name' | 'bio' | 'location' | 'website' | 'status' | 'tags'>>): Promise<void> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;
  await sb.from('profiles').update(patch).eq('id', user.id);
}

// ─── Snippets ────────────────────────────────────────────────────────────────

export async function getPinnedSnippets(username: string): Promise<Snippet[]> {
  const sb = createClient();
  const { data: profile } = await sb.from('profiles').select('id').eq('username', username).single();
  if (!profile) return [];
  const { data } = await sb.from('snippets').select('*').eq('user_id', profile.id).eq('pinned', true).order('created_at', { ascending: false });
  return data ?? [];
}

export async function getMySnippets(): Promise<Snippet[]> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return [];
  const { data } = await sb.from('snippets').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
  return data ?? [];
}

export async function createSnippet(title: string, language: string, code: string, description: string, pinned = false): Promise<Snippet> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data, error } = await sb.from('snippets').insert({ user_id: user.id, title, language, code, description, pinned }).select().single();
  if (error) throw error;
  return data;
}

export async function updateSnippet(id: string, patch: Partial<Pick<Snippet, 'title' | 'language' | 'code' | 'description' | 'pinned'>>): Promise<void> {
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

// ─── Learning Goals ──────────────────────────────────────────────────────────

export async function getLearningGoals(): Promise<LearningGoal[]> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return [];
  const { data } = await sb.from('learning_goals').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
  return data ?? [];
}

export async function createLearningGoal(goal: string, target_days: number): Promise<LearningGoal> {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data, error } = await sb.from('learning_goals').insert({ user_id: user.id, goal, target_days }).select().single();
  if (error) throw error;
  return data;
}

export async function updateLearningGoal(id: string, patch: Partial<Pick<LearningGoal, 'goal' | 'target_days' | 'elapsed_days'>>): Promise<void> {
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

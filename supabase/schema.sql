-- ============================================================
-- DevEco Ecosystem — Supabase Schema
-- Run this entire file in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- UPDATED_AT TRIGGER (reused on all tables)
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- PROFILES (DevFolio hub — one row per authenticated user)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username      TEXT UNIQUE NOT NULL,
  display_name  TEXT,
  bio           TEXT DEFAULT '',
  location      TEXT DEFAULT '',
  website       TEXT DEFAULT '',
  status        TEXT DEFAULT '',
  tags          TEXT[] DEFAULT '{}',
  avatar_url    TEXT,
  github_username TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Auto-create profile on GitHub sign-in
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url, github_username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'user_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'user_name'),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'user_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- LEARNING GOALS (DevFolio)
-- ============================================================
CREATE TABLE IF NOT EXISTS learning_goals (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  goal         TEXT NOT NULL,
  target_days  INTEGER NOT NULL DEFAULT 30,
  elapsed_days INTEGER NOT NULL DEFAULT 0,
  started_at   DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_learning_goals_user ON learning_goals(user_id);

-- ============================================================
-- SNIPPETS (DevFolio)
-- ============================================================
CREATE TABLE IF NOT EXISTS snippets (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  language    TEXT NOT NULL DEFAULT 'typescript',
  code        TEXT NOT NULL,
  description TEXT DEFAULT '',
  pinned      BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_snippets_updated_at
  BEFORE UPDATE ON snippets
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_snippets_user ON snippets(user_id);

-- ============================================================
-- GITHUB CACHE (DevFolio — avoid GitHub rate limiting)
-- ============================================================
CREATE TABLE IF NOT EXISTS github_cache (
  username    TEXT PRIMARY KEY,
  data        JSONB NOT NULL DEFAULT '{}',
  fetched_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_github_cache_fetched ON github_cache(fetched_at);

-- ============================================================
-- NOTES (DevNotes)
-- ============================================================
CREATE TABLE IF NOT EXISTS notes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  content_md  TEXT DEFAULT '',
  tags        TEXT[] DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_notes_user ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_updated ON notes(user_id, updated_at DESC);

-- ============================================================
-- TIMER SESSIONS (DevTimer)
-- ============================================================
CREATE TABLE IF NOT EXISTS timer_sessions (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  duration_secs  INTEGER NOT NULL,
  mode           TEXT NOT NULL DEFAULT 'work' CHECK (mode IN ('work', 'break', 'long_break')),
  label          TEXT,
  completed_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_timer_sessions_user ON timer_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_timer_sessions_date ON timer_sessions(user_id, completed_at DESC);

-- ============================================================
-- CALENDAR EVENTS (DevCalendar)
-- ============================================================
CREATE TABLE IF NOT EXISTS calendar_events (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  date        DATE NOT NULL,
  time        TIME,
  type        TEXT NOT NULL DEFAULT 'task' CHECK (type IN ('task', 'meeting', 'deadline', 'reminder')),
  done        BOOLEAN DEFAULT FALSE,
  note        TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_calendar_events_user ON calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_date ON calendar_events(user_id, date);

-- ============================================================
-- GOALS (DevCalendar)
-- ============================================================
CREATE TABLE IF NOT EXISTS calendar_goals (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  deadline    DATE NOT NULL,
  progress    INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  color       TEXT NOT NULL DEFAULT '#ff6eb4',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_calendar_goals_updated_at
  BEFORE UPDATE ON calendar_goals
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_calendar_goals_user ON calendar_goals(user_id);

-- ============================================================
-- ROADMAP PROGRESS (DevRoadmap)
-- ============================================================
CREATE TABLE IF NOT EXISTS roadmap_progress (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  track_id     TEXT NOT NULL,
  skill_id     TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, track_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_roadmap_progress_user ON roadmap_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_progress_track ON roadmap_progress(user_id, track_id);

-- ============================================================
-- BLOG POSTS (DevBlog)
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  slug         TEXT NOT NULL,
  content_md   TEXT NOT NULL DEFAULT '',
  excerpt      TEXT DEFAULT '',
  tags         TEXT[] DEFAULT '{}',
  published    BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, slug)
);

CREATE TRIGGER trg_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_blog_posts_user ON blog_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published, published_at DESC);

-- ============================================================
-- STATUS PAGES (DevStatus)
-- ============================================================
CREATE TABLE IF NOT EXISTS status_pages (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  username     TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  services     JSONB NOT NULL DEFAULT '[]',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_status_pages_updated_at
  BEFORE UPDATE ON status_pages
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_status_pages_username ON status_pages(username);

-- ============================================================
-- INCIDENTS (DevStatus)
-- ============================================================
CREATE TABLE IF NOT EXISTS incidents (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  status_page_id UUID NOT NULL REFERENCES status_pages(id) ON DELETE CASCADE,
  title          TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'investigating'
                   CHECK (status IN ('investigating','identified','monitoring','resolved')),
  severity       TEXT NOT NULL DEFAULT 'minor'
                   CHECK (severity IN ('minor','major','critical')),
  updates        JSONB NOT NULL DEFAULT '[]',
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  resolved_at    TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_incidents_page ON incidents(status_page_id);

-- ============================================================
-- ENV VAULT (DevEnv)
-- ============================================================
CREATE TABLE IF NOT EXISTS env_projects (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  vars        JSONB NOT NULL DEFAULT '[]',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_env_projects_updated_at
  BEFORE UPDATE ON env_projects
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_env_projects_user ON env_projects(user_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE github_cache    ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_goals  ENABLE ROW LEVEL SECURITY;
ALTER TABLE snippets        ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes           ENABLE ROW LEVEL SECURITY;
ALTER TABLE timer_sessions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_goals  ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts      ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_pages    ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents       ENABLE ROW LEVEL SECURITY;
ALTER TABLE env_projects    ENABLE ROW LEVEL SECURITY;

-- GITHUB CACHE: public read, authenticated upsert
CREATE POLICY "github_cache_public_read"         ON github_cache FOR SELECT USING (true);
CREATE POLICY "github_cache_authenticated_insert" ON github_cache FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "github_cache_authenticated_update" ON github_cache FOR UPDATE USING (auth.role() = 'authenticated');

-- PROFILES: public read, owner write
CREATE POLICY "profiles_public_read"  ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_owner_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_owner_update" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_owner_delete" ON profiles FOR DELETE USING (auth.uid() = id);

-- LEARNING GOALS: owner only
CREATE POLICY "learning_goals_owner" ON learning_goals FOR ALL USING (auth.uid() = user_id);

-- SNIPPETS: public read pinned, owner all
CREATE POLICY "snippets_public_read"  ON snippets FOR SELECT USING (pinned = true OR auth.uid() = user_id);
CREATE POLICY "snippets_owner_write"  ON snippets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "snippets_owner_update" ON snippets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "snippets_owner_delete" ON snippets FOR DELETE USING (auth.uid() = user_id);

-- NOTES: owner only
CREATE POLICY "notes_owner" ON notes FOR ALL USING (auth.uid() = user_id);

-- TIMER SESSIONS: owner only
CREATE POLICY "timer_sessions_owner" ON timer_sessions FOR ALL USING (auth.uid() = user_id);

-- CALENDAR EVENTS: owner only
CREATE POLICY "calendar_events_owner" ON calendar_events FOR ALL USING (auth.uid() = user_id);

-- CALENDAR GOALS: owner only
CREATE POLICY "calendar_goals_owner" ON calendar_goals FOR ALL USING (auth.uid() = user_id);

-- ROADMAP PROGRESS: owner only
CREATE POLICY "roadmap_progress_owner" ON roadmap_progress FOR ALL USING (auth.uid() = user_id);

-- BLOG POSTS: public read published, owner all
CREATE POLICY "blog_posts_public_read"  ON blog_posts FOR SELECT USING (published = true OR auth.uid() = user_id);
CREATE POLICY "blog_posts_owner_insert" ON blog_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "blog_posts_owner_update" ON blog_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "blog_posts_owner_delete" ON blog_posts FOR DELETE USING (auth.uid() = user_id);

-- STATUS PAGES: public read, owner write
CREATE POLICY "status_pages_public_read"  ON status_pages FOR SELECT USING (true);
CREATE POLICY "status_pages_owner_insert" ON status_pages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "status_pages_owner_update" ON status_pages FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "status_pages_owner_delete" ON status_pages FOR DELETE USING (auth.uid() = user_id);

-- INCIDENTS: public read, owner of the status page writes
CREATE POLICY "incidents_public_read" ON incidents FOR SELECT USING (true);
CREATE POLICY "incidents_owner_write" ON incidents FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM status_pages WHERE id = status_page_id AND user_id = auth.uid()));
CREATE POLICY "incidents_owner_update" ON incidents FOR UPDATE
  USING (EXISTS (SELECT 1 FROM status_pages WHERE id = status_page_id AND user_id = auth.uid()));
CREATE POLICY "incidents_owner_delete" ON incidents FOR DELETE
  USING (EXISTS (SELECT 1 FROM status_pages WHERE id = status_page_id AND user_id = auth.uid()));

-- ENV PROJECTS: owner only
CREATE POLICY "env_projects_owner" ON env_projects FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- APK APPS (DevAPK Hub)
-- ============================================================
CREATE TABLE IF NOT EXISTS apk_apps (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL,
  description     TEXT DEFAULT '',
  package_name    TEXT NOT NULL DEFAULT '',
  icon_url        TEXT,
  category        TEXT NOT NULL DEFAULT 'other'
                    CHECK (category IN ('utility','game','productivity','social','media','finance','education','other')),
  tags            TEXT[] DEFAULT '{}',
  is_public       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, slug)
);

CREATE TRIGGER trg_apk_apps_updated_at
  BEFORE UPDATE ON apk_apps
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_apk_apps_user     ON apk_apps(user_id);
CREATE INDEX IF NOT EXISTS idx_apk_apps_public   ON apk_apps(is_public, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_apk_apps_category ON apk_apps(category, is_public);

-- ============================================================
-- APK BUILDS (DevAPK Hub)
-- ============================================================
CREATE TABLE IF NOT EXISTS apk_builds (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  app_id          UUID NOT NULL REFERENCES apk_apps(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  version_name    TEXT NOT NULL,
  version_code    INTEGER NOT NULL DEFAULT 1,
  file_url        TEXT NOT NULL,
  file_name       TEXT NOT NULL,
  file_size       BIGINT NOT NULL DEFAULT 0,
  build_type      TEXT NOT NULL DEFAULT 'release'
                    CHECK (build_type IN ('debug','release')),
  changelog       TEXT DEFAULT '',
  min_sdk         INTEGER DEFAULT 21,
  target_sdk      INTEGER DEFAULT 34,
  permissions     TEXT[] DEFAULT '{}',
  download_count  INTEGER NOT NULL DEFAULT 0,
  sha256          TEXT DEFAULT '',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_apk_builds_app  ON apk_builds(app_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_apk_builds_user ON apk_builds(user_id);

CREATE OR REPLACE FUNCTION increment_apk_download(build_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE apk_builds SET download_count = download_count + 1 WHERE id = build_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER TABLE apk_apps   ENABLE ROW LEVEL SECURITY;
ALTER TABLE apk_builds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "apk_apps_public_read"
  ON apk_apps FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "apk_apps_owner_insert"
  ON apk_apps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "apk_apps_owner_update"
  ON apk_apps FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "apk_apps_owner_delete"
  ON apk_apps FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "apk_builds_public_read"
  ON apk_builds FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM apk_apps
    WHERE id = apk_builds.app_id AND (is_public = true OR user_id = auth.uid())
  ));
CREATE POLICY "apk_builds_owner_insert"
  ON apk_builds FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "apk_builds_owner_delete"
  ON apk_builds FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- STORAGE — apk-files bucket
-- ============================================================
-- Creates the bucket (safe to re-run — ON CONFLICT DO NOTHING)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'apk-files',
  'apk-files',
  true,
  52428800,    -- 50 MB per file (Supabase free tier limit)
  ARRAY[
    'application/vnd.android.package-archive',
    'application/octet-stream',
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/gif'
  ]
)
ON CONFLICT (id) DO UPDATE
  SET public             = EXCLUDED.public,
      file_size_limit    = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ── Storage RLS policies for apk-files ──────────────────────

-- Anyone can read/download public files
CREATE POLICY "apk_files_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'apk-files');

-- Authenticated users can upload into their own folder ({user_id}/...)
CREATE POLICY "apk_files_owner_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'apk-files'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated users can update their own files
CREATE POLICY "apk_files_owner_update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'apk-files'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Authenticated users can delete their own files
CREATE POLICY "apk_files_owner_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'apk-files'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

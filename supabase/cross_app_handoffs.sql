-- Cross-app authentication handoff tickets
-- Run this SQL in your Supabase dashboard > SQL Editor
-- Enables DevFolio to authenticate users in child ecosystem apps (APK Hub, etc.)

CREATE TABLE IF NOT EXISTS cross_app_handoffs (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL,
  access_token  TEXT        NOT NULL,
  refresh_token TEXT        NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  expires_at    TIMESTAMPTZ DEFAULT NOW() + INTERVAL '60 seconds',
  used          BOOLEAN     DEFAULT FALSE
);

-- No public access — only service role key can read/write
ALTER TABLE cross_app_handoffs ENABLE ROW LEVEL SECURITY;

-- Index for fast expiry lookups and cleanup
CREATE INDEX IF NOT EXISTS idx_cross_app_handoffs_expires
  ON cross_app_handoffs (expires_at);

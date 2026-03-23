CREATE TABLE IF NOT EXISTS demo_donate_requests (
  id BIGSERIAL PRIMARY KEY,
  request_code TEXT NOT NULL UNIQUE,
  guild_id TEXT NOT NULL,
  channel_id TEXT,
  message_id TEXT,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  discord_tag TEXT,
  player_name TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  payment_method TEXT,
  proof_url TEXT,
  note TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING',
  reviewer_id TEXT,
  reviewer_name TEXT,
  review_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_demo_donate_requests_status
  ON demo_donate_requests(status);

CREATE INDEX IF NOT EXISTS idx_demo_donate_requests_user_id
  ON demo_donate_requests(user_id);

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  guild_id TEXT NOT NULL,
  actor_id TEXT,
  actor_name TEXT,
  action_type TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  details_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_guild_id
  ON audit_logs(guild_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action_type
  ON audit_logs(action_type);

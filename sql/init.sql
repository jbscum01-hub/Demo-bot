CREATE TABLE IF NOT EXISTS schema_migrations (
  id BIGSERIAL PRIMARY KEY,
  migration_key TEXT NOT NULL UNIQUE,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tenants (
  id BIGSERIAL PRIMARY KEY,
  guild_id TEXT NOT NULL UNIQUE,
  guild_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  language TEXT NOT NULL DEFAULT 'th',
  timezone TEXT NOT NULL DEFAULT 'Asia/Bangkok',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tenant_config (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  config_key TEXT NOT NULL,
  config_value TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, config_key)
);

CREATE TABLE IF NOT EXISTS tenant_modules (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  module_key TEXT NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, module_key)
);

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

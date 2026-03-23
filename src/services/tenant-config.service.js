const { query } = require('../db/query');

async function upsertTenantConfigByGuildId(guildId, configKey, configValue) {
  await query(
    `INSERT INTO tenant_config (tenant_id, config_key, config_value)
     SELECT t.id, $2, $3
     FROM tenants t
     WHERE t.guild_id = $1
     ON CONFLICT (tenant_id, config_key)
     DO UPDATE SET config_value = EXCLUDED.config_value, updated_at = NOW()`,
    [guildId, configKey, configValue]
  );
}

module.exports = { upsertTenantConfigByGuildId };

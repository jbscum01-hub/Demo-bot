const env = require('../config/env');
const { query } = require('../db/query');
const logger = require('../utils/logger');

const CONFIG_KEYS = {
  DONATE_REVIEW_CHANNEL_ID: 'DONATE_REVIEW_CHANNEL_ID',
  WHITELIST_REVIEW_CHANNEL_ID: 'WHITELIST_REVIEW_CHANNEL_ID',
  AUDIT_LOG_CHANNEL_ID: 'AUDIT_LOG_CHANNEL_ID',
  DEMO_PANEL_CHANNEL_ID: 'DEMO_PANEL_CHANNEL_ID'
};

async function ensureTenant(guild) {
  await query(
    `INSERT INTO tenants (guild_id, guild_name, language, timezone)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (guild_id)
     DO UPDATE SET guild_name = EXCLUDED.guild_name, updated_at = NOW()`,
    [guild.id, guild.name, env.DEFAULT_LANGUAGE, env.DEFAULT_TIMEZONE]
  );

  const tenant = await getTenantByGuildId(guild.id);
  await seedTenantModules(tenant.id);
  await seedTenantConfig(tenant.id);
  return tenant;
}

async function getTenantByGuildId(guildId) {
  const result = await query(`SELECT * FROM tenants WHERE guild_id = $1 LIMIT 1`, [guildId]);
  return result.rows[0] || null;
}

async function seedTenantModules(tenantId) {
  for (const moduleKey of env.DEFAULT_ENABLED_MODULES) {
    await query(
      `INSERT INTO tenant_modules (tenant_id, module_key, is_enabled)
       VALUES ($1, $2, TRUE)
       ON CONFLICT (tenant_id, module_key)
       DO NOTHING`,
      [tenantId, moduleKey]
    );
  }
}

async function seedTenantConfig(tenantId) {
  const defaults = {
    [CONFIG_KEYS.DONATE_REVIEW_CHANNEL_ID]: env.DONATE_REVIEW_CHANNEL_ID || null,
    [CONFIG_KEYS.WHITELIST_REVIEW_CHANNEL_ID]: env.WHITELIST_REVIEW_CHANNEL_ID || null,
    [CONFIG_KEYS.AUDIT_LOG_CHANNEL_ID]: env.AUDIT_LOG_CHANNEL_ID || null,
    [CONFIG_KEYS.DEMO_PANEL_CHANNEL_ID]: env.DEMO_PANEL_CHANNEL_ID || null
  };

  for (const [configKey, configValue] of Object.entries(defaults)) {
    await query(
      `INSERT INTO tenant_config (tenant_id, config_key, config_value)
       VALUES ($1, $2, $3)
       ON CONFLICT (tenant_id, config_key)
       DO NOTHING`,
      [tenantId, configKey, configValue]
    );
  }
}

async function getTenantConfigMap(guildId) {
  const result = await query(
    `SELECT tc.config_key, tc.config_value
     FROM tenant_config tc
     INNER JOIN tenants t ON t.id = tc.tenant_id
     WHERE t.guild_id = $1`,
    [guildId]
  );

  return result.rows.reduce((acc, row) => {
    acc[row.config_key] = row.config_value || '';
    return acc;
  }, {});
}

async function isModuleEnabled(guildId, moduleKey) {
  const result = await query(
    `SELECT tm.is_enabled
     FROM tenant_modules tm
     INNER JOIN tenants t ON t.id = tm.tenant_id
     WHERE t.guild_id = $1 AND tm.module_key = $2
     LIMIT 1`,
    [guildId, moduleKey]
  );
  return result.rows[0]?.is_enabled === true;
}

async function syncAllGuilds(client) {
  for (const guild of client.guilds.cache.values()) {
    const tenant = await ensureTenant(guild);
    const config = await getTenantConfigMap(guild.id);
    const missing = [];

    if (!config[CONFIG_KEYS.DONATE_REVIEW_CHANNEL_ID]) missing.push(CONFIG_KEYS.DONATE_REVIEW_CHANNEL_ID);
    if (!config[CONFIG_KEYS.WHITELIST_REVIEW_CHANNEL_ID]) missing.push(CONFIG_KEYS.WHITELIST_REVIEW_CHANNEL_ID);
    if (!config[CONFIG_KEYS.AUDIT_LOG_CHANNEL_ID]) missing.push(CONFIG_KEYS.AUDIT_LOG_CHANNEL_ID);
    if (!config[CONFIG_KEYS.DEMO_PANEL_CHANNEL_ID]) missing.push(CONFIG_KEYS.DEMO_PANEL_CHANNEL_ID);

    logger.info('Tenant synced', {
      guild_id: guild.id,
      guild_name: guild.name,
      tenant_id: tenant.id,
      missing_config: missing
    });
  }
}

module.exports = {
  CONFIG_KEYS,
  ensureTenant,
  getTenantByGuildId,
  getTenantConfigMap,
  isModuleEnabled,
  syncAllGuilds
};

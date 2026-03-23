const { getTenantConfigMap, isModuleEnabled } = require('../tenants/tenant.service');

async function ensureDonateFlowReady(guildId) {
  const enabled = await isModuleEnabled(guildId, 'donate');
  if (!enabled) {
    throw new Error('[MODULE_DISABLED] Donate module is disabled for this guild');
  }

  const config = await getTenantConfigMap(guildId);
  const missing = [];
  if (!config.DONATE_REVIEW_CHANNEL_ID) missing.push('DONATE_REVIEW_CHANNEL_ID');
  if (!config.AUDIT_LOG_CHANNEL_ID) missing.push('AUDIT_LOG_CHANNEL_ID');

  if (missing.length) {
    throw new Error(`[TENANT_CONFIG_MISSING] Missing config: ${missing.join(', ')}`);
  }

  return config;
}

async function ensureWhitelistFlowReady(guildId) {
  const enabled = await isModuleEnabled(guildId, 'whitelist');
  if (!enabled) {
    throw new Error('[MODULE_DISABLED] Whitelist module is disabled for this guild');
  }

  const config = await getTenantConfigMap(guildId);
  const missing = [];
  if (!config.WHITELIST_REVIEW_CHANNEL_ID) missing.push('WHITELIST_REVIEW_CHANNEL_ID');
  if (!config.AUDIT_LOG_CHANNEL_ID) missing.push('AUDIT_LOG_CHANNEL_ID');

  if (missing.length) {
    throw new Error(`[TENANT_CONFIG_MISSING] Missing config: ${missing.join(', ')}`);
  }

  return config;
}

async function ensureSupportFlowReady(guildId) {
  const enabled = await isModuleEnabled(guildId, 'support');
  if (!enabled) {
    throw new Error('[MODULE_DISABLED] Support module is disabled for this guild');
  }

  const config = await getTenantConfigMap(guildId);
  const missing = [];
  if (!config.SUPPORT_REVIEW_CHANNEL_ID) missing.push('SUPPORT_REVIEW_CHANNEL_ID');
  if (!config.AUDIT_LOG_CHANNEL_ID) missing.push('AUDIT_LOG_CHANNEL_ID');

  if (missing.length) {
    throw new Error(`[TENANT_CONFIG_MISSING] Missing config: ${missing.join(', ')}`);
  }

  return config;
}

module.exports = { ensureDonateFlowReady, ensureWhitelistFlowReady, ensureSupportFlowReady };

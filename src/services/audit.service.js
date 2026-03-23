const { query } = require('../db/query');
const logger = require('../utils/logger');
const { getTenantConfigMap } = require('../tenants/tenant.service');

async function writeAuditLog({ guildId, actorId, actorName, actionType, targetType, targetId, details }) {
  await query(
    `INSERT INTO audit_logs (
      guild_id, actor_id, actor_name, action_type, target_type, target_id, details_json
    ) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [guildId, actorId || null, actorName || null, actionType, targetType, targetId || null, details || {}]
  );
}

async function sendAuditLogToDiscord(client, guildId, lines = []) {
  try {
    const config = await getTenantConfigMap(guildId);
    const channelId = config.AUDIT_LOG_CHANNEL_ID;
    if (!channelId) return;
    const channel = await client.channels.fetch(channelId);
    if (!channel || !channel.isTextBased()) return;
    await channel.send(lines.join('\n').slice(0, 1900));
  } catch (error) {
    logger.warn('Failed to send audit log to Discord', { error: error.message, guildId });
  }
}

module.exports = { writeAuditLog, sendAuditLogToDiscord };

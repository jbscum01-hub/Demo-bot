const {
  Client,
  GatewayIntentBits,
  Partials
} = require('discord.js');
const logger = require('./utils/logger');
const { pool } = require('./db/pool');
const { routeInteraction } = require('./core/router');
const { buildDemoPanelPayload } = require('./core/panel');
const { syncAllGuilds, CONFIG_KEYS } = require('./tenants/tenant.service');
const { upsertTenantConfigByGuildId } = require('./services/tenant-config.service');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

client.once('ready', async () => {
  logger.info(`Logged in as ${client.user.tag}`);
  try {
    await pool.query('SELECT 1');
    logger.info('Database connection OK');
    await syncAllGuilds(client);
  } catch (error) {
    logger.error('Startup sync failed', { error: error.message });
  }
});

client.on('guildCreate', async (guild) => {
  try {
    await syncAllGuilds(client);
    logger.info('Guild joined and synced', { guild_id: guild.id, guild_name: guild.name });
  } catch (error) {
    logger.error('Failed to sync joined guild', { guild_id: guild.id, error: error.message });
  }
});

client.on('interactionCreate', async (interaction) => {
  try {
    await routeInteraction(interaction);
  } catch (error) {
    logger.error('Interaction handling failed', {
      customId: interaction.customId,
      userId: interaction.user?.id,
      error: error.message
    });

    const content = error.message?.startsWith('[TENANT_CONFIG_MISSING]')
      ? 'ยังตั้งค่าห้องไม่ครบ ใช้ `!setup-panel`, `!setup-review-donate`, `!setup-review-whitelist`, `!setup-log` ก่อน'
      : error.message?.startsWith('[MODULE_DISABLED]')
        ? 'โมดูลนี้ยังไม่เปิดใช้งานสำหรับเซิร์ฟเวอร์นี้'
        : 'เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่หรือตรวจสอบ config / database';

    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({ content, flags: 64 }).catch(() => null);
    } else {
      await interaction.reply({ content, flags: 64 }).catch(() => null);
    }
  }
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;

  if (message.content === '!demo-panel') {
    await message.channel.send(buildDemoPanelPayload());
    return;
  }

  if (message.content === '!setup-panel') {
    await upsertTenantConfigByGuildId(message.guild.id, CONFIG_KEYS.DEMO_PANEL_CHANNEL_ID, message.channel.id);
    await message.reply('ตั้งค่าห้อง panel สำเร็จแล้ว ✅\n- ห้องนี้ถูกใช้เป็น DEMO_PANEL_CHANNEL_ID');
    return;
  }

  if (message.content === '!setup-review-donate') {
    await upsertTenantConfigByGuildId(message.guild.id, CONFIG_KEYS.DONATE_REVIEW_CHANNEL_ID, message.channel.id);
    await message.reply('ตั้งค่าห้องรีวิว Donate สำเร็จแล้ว ✅');
    return;
  }

  if (message.content === '!setup-review-whitelist') {
    await upsertTenantConfigByGuildId(message.guild.id, CONFIG_KEYS.WHITELIST_REVIEW_CHANNEL_ID, message.channel.id);
    await message.reply('ตั้งค่าห้องรีวิว Whitelist สำเร็จแล้ว ✅');
    return;
  }

  if (message.content === '!setup-log') {
    await upsertTenantConfigByGuildId(message.guild.id, CONFIG_KEYS.AUDIT_LOG_CHANNEL_ID, message.channel.id);
    await message.reply('ตั้งค่าห้อง log สำเร็จแล้ว ✅');
    return;
  }

  if (message.content === '!setup-demo') {
    await upsertTenantConfigByGuildId(message.guild.id, CONFIG_KEYS.DEMO_PANEL_CHANNEL_ID, message.channel.id);
    await upsertTenantConfigByGuildId(message.guild.id, CONFIG_KEYS.DONATE_REVIEW_CHANNEL_ID, message.channel.id);
    await upsertTenantConfigByGuildId(message.guild.id, CONFIG_KEYS.WHITELIST_REVIEW_CHANNEL_ID, message.channel.id);
    await upsertTenantConfigByGuildId(message.guild.id, CONFIG_KEYS.AUDIT_LOG_CHANNEL_ID, message.channel.id);
    await message.reply('ตั้งค่า demo สำเร็จแล้ว ✅\n- ห้องนี้ถูกใช้เป็น panel / donate review / whitelist review / audit log');
    return;
  }
});

client.login(require('./config/env').DISCORD_TOKEN);

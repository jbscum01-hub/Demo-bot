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
      ? 'ยังตั้งค่าห้องรีวิวหรือห้อง log ไม่ครบ ใช้คำสั่ง `!setup-demo` ในห้องที่ต้องการก่อน'
      : error.message?.startsWith('[MODULE_DISABLED]')
        ? 'โมดูลนี้ยังไม่เปิดใช้งานสำหรับเซิร์ฟเวอร์นี้'
        : 'เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่หรือตรวจสอบ config / database';

    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({ content, ephemeral: true }).catch(() => null);
    } else {
      await interaction.reply({ content, ephemeral: true }).catch(() => null);
    }
  }
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;

  if (message.content === '!demo-panel') {
    await message.channel.send(buildDemoPanelPayload());
    return;
  }

  if (message.content === '!setup-demo') {
    await upsertTenantConfigByGuildId(message.guild.id, CONFIG_KEYS.DONATE_REVIEW_CHANNEL_ID, message.channel.id);
    await upsertTenantConfigByGuildId(message.guild.id, CONFIG_KEYS.AUDIT_LOG_CHANNEL_ID, message.channel.id);
    await message.reply('ตั้งค่า demo สำเร็จแล้ว ✅\n- ห้องนี้ถูกใช้เป็น DONATE_REVIEW_CHANNEL_ID\n- ห้องนี้ถูกใช้เป็น AUDIT_LOG_CHANNEL_ID');
    return;
  }
});

client.login(require('./config/env').DISCORD_TOKEN);

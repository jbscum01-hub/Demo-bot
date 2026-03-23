const {
  Client,
  GatewayIntentBits,
  Partials
} = require('discord.js');
const env = require('./config/env');
const logger = require('./utils/logger');
const { pool } = require('./db/pool');
const { routeInteraction } = require('./core/router');
const { buildDemoPanelPayload } = require('./core/panel');

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
  } catch (error) {
    logger.error('Database connection failed on startup', { error: error.message });
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

    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({
        content: 'เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่หรือตรวจสอบ config / database',
        ephemeral: true
      }).catch(() => null);
    } else {
      await interaction.reply({
        content: 'เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่หรือตรวจสอบ config / database',
        ephemeral: true
      }).catch(() => null);
    }
  }
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.content === '!demo-panel') {
    await message.channel.send(buildDemoPanelPayload());
  }
});

client.login(env.DISCORD_TOKEN);

const dotenv = require('dotenv');

dotenv.config();

const requiredKeys = [
  'DISCORD_TOKEN',
  'CLIENT_ID',
  'GUILD_ID',
  'DATABASE_URL',
  'DONATE_REVIEW_CHANNEL_ID',
  'AUDIT_LOG_CHANNEL_ID'
];

for (const key of requiredKeys) {
  if (!process.env[key]) {
    throw new Error(`[ENV_MISSING] Missing required environment variable: ${key}`);
  }
}

module.exports = {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  CLIENT_ID: process.env.CLIENT_ID,
  GUILD_ID: process.env.GUILD_ID,
  DATABASE_URL: process.env.DATABASE_URL,
  DONATE_REVIEW_CHANNEL_ID: process.env.DONATE_REVIEW_CHANNEL_ID,
  AUDIT_LOG_CHANNEL_ID: process.env.AUDIT_LOG_CHANNEL_ID,
  DB_SSL: String(process.env.DB_SSL || 'true').toLowerCase() === 'true'
};

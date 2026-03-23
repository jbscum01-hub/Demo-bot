const dotenv = require('dotenv');

dotenv.config();

const requiredKeys = ['DISCORD_TOKEN', 'DATABASE_URL'];
for (const key of requiredKeys) {
  if (!process.env[key]) {
    throw new Error(`[ENV_MISSING] Missing required environment variable: ${key}`);
  }
}

function splitModules(input) {
  return String(input || 'donate,whitelist,support')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

module.exports = {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  CLIENT_ID: process.env.CLIENT_ID || '',
  DATABASE_URL: process.env.DATABASE_URL,
  DONATE_REVIEW_CHANNEL_ID: process.env.DONATE_REVIEW_CHANNEL_ID || '',
  WHITELIST_REVIEW_CHANNEL_ID: process.env.WHITELIST_REVIEW_CHANNEL_ID || '',
  SUPPORT_REVIEW_CHANNEL_ID: process.env.SUPPORT_REVIEW_CHANNEL_ID || '',
  AUDIT_LOG_CHANNEL_ID: process.env.AUDIT_LOG_CHANNEL_ID || '',
  DEMO_PANEL_CHANNEL_ID: process.env.DEMO_PANEL_CHANNEL_ID || '',
  DEFAULT_LANGUAGE: process.env.DEFAULT_LANGUAGE || 'th',
  DEFAULT_TIMEZONE: process.env.DEFAULT_TIMEZONE || 'Asia/Bangkok',
  DEFAULT_ENABLED_MODULES: splitModules(process.env.DEFAULT_ENABLED_MODULES),
  DB_SSL: String(process.env.DB_SSL || 'true').toLowerCase() === 'true'
};

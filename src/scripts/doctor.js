const env = require('../config/env');
const { pool } = require('../db/pool');
const { query } = require('../db/query');

async function main() {
  console.log('[DOCTOR] Running checks...');

  await pool.query('SELECT 1');
  console.log('[OK] Database connected');

  const tables = [
    'tenants',
    'tenant_config',
    'tenant_modules',
    'demo_donate_requests',
    'demo_whitelist_requests',
    'demo_support_requests',
    'audit_logs'
  ];

  for (const table of tables) {
    const result = await query(
      `SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = $1
      ) AS exists`,
      [table]
    );

    if (!result.rows[0]?.exists) {
      throw new Error(`[TABLE_MISSING] ${table}`);
    }
  }

  console.log('[OK] Tables ready');
  console.log(`[OK] Default modules: ${env.DEFAULT_ENABLED_MODULES.join(', ')}`);
  console.log(`[INFO] Default donate review channel: ${env.DONATE_REVIEW_CHANNEL_ID || '-'}`);
  console.log(`[INFO] Default whitelist review channel: ${env.WHITELIST_REVIEW_CHANNEL_ID || '-'}`);
  console.log(`[INFO] Default support review channel: ${env.SUPPORT_REVIEW_CHANNEL_ID || '-'}`);
  console.log(`[INFO] Default audit log channel: ${env.AUDIT_LOG_CHANNEL_ID || '-'}`);
  console.log('[DOCTOR] All checks passed');
}

main().catch((error) => {
  console.error('[DOCTOR] Failed:', error.message);
  process.exit(1);
});

const env = require('../config/env');
const { pool } = require('../db/pool');

(async () => {
  try {
    console.log('[OK] ENV loaded');
    console.log(`[OK] GUILD_ID = ${env.GUILD_ID}`);
    console.log(`[OK] DONATE_REVIEW_CHANNEL_ID = ${env.DONATE_REVIEW_CHANNEL_ID}`);
    console.log(`[OK] AUDIT_LOG_CHANNEL_ID = ${env.AUDIT_LOG_CHANNEL_ID}`);

    await pool.query('SELECT 1');
    console.log('[OK] Database connected');

    const tables = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN ('demo_donate_requests', 'audit_logs')
      ORDER BY table_name
    `);

    const found = tables.rows.map((r) => r.table_name);
    for (const tableName of ['demo_donate_requests', 'audit_logs']) {
      if (found.includes(tableName)) {
        console.log(`[OK] Table exists: ${tableName}`);
      } else {
        console.log(`[FAIL] Missing table: ${tableName}`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('[FAIL]', error.message);
    process.exit(1);
  }
})();

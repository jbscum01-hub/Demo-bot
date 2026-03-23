const env = require('../config/env');
const { pool } = require('../db/pool');

const requiredTables = [
  'schema_migrations',
  'tenants',
  'tenant_config',
  'tenant_modules',
  'demo_donate_requests',
  'demo_whitelist_requests',
  'audit_logs'
];

(async () => {
  try {
    console.log('[OK] ENV loaded');
    console.log(`[OK] DEFAULT_LANGUAGE = ${env.DEFAULT_LANGUAGE}`);
    console.log(`[OK] DEFAULT_TIMEZONE = ${env.DEFAULT_TIMEZONE}`);
    console.log(`[OK] DEFAULT_ENABLED_MODULES = ${env.DEFAULT_ENABLED_MODULES.join(', ')}`);

    await pool.query('SELECT 1');
    console.log('[OK] Database connected');

    const tables = await pool.query(
      `SELECT table_name
       FROM information_schema.tables
       WHERE table_schema = 'public'
         AND table_name = ANY($1)
       ORDER BY table_name`,
      [requiredTables]
    );

    const found = tables.rows.map((r) => r.table_name);
    for (const tableName of requiredTables) {
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

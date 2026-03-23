const path = require('path');
const fs = require('fs');
const { pool } = require('../db/pool');
const logger = require('../utils/logger');

async function runDbInit() {
  const sqlPath = path.join(__dirname, '../../sql/init.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  await pool.query(sql);
  logger.info('DB init completed');
}

async function runHealthcheck() {
  const result = await pool.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name IN (
        'schema_migrations',
        'tenants',
        'tenant_config',
        'tenant_modules',
        'demo_donate_requests',
        'audit_logs'
      )
    ORDER BY table_name
  `);

  const found = new Set(result.rows.map((row) => row.table_name));
  const required = [
    'schema_migrations',
    'tenants',
    'tenant_config',
    'tenant_modules',
    'demo_donate_requests',
    'audit_logs'
  ];

  const missing = required.filter((name) => !found.has(name));
  if (missing.length) {
    throw new Error(`[HEALTHCHECK_FAILED] Missing tables: ${missing.join(', ')}`);
  }

  logger.info('Healthcheck passed', { tables: required.length });
}

module.exports = { runDbInit, runHealthcheck };

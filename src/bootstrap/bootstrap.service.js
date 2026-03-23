const path = require('path');
const fs = require('fs');
const { pool } = require('../db/pool');
const logger = require('../utils/logger');

const REQUIRED_TABLES = [
  'schema_migrations',
  'tenants',
  'tenant_config',
  'tenant_modules',
  'demo_donate_requests',
  'demo_whitelist_requests',
  'audit_logs'
];

async function runDbInit() {
  const sqlPath = path.join(__dirname, '../../sql/init.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  await pool.query(sql);
  logger.info('DB init completed');
}

async function runHealthcheck() {
  const result = await pool.query(
    `SELECT table_name
     FROM information_schema.tables
     WHERE table_schema = 'public'
       AND table_name = ANY($1)
     ORDER BY table_name`,
    [REQUIRED_TABLES]
  );

  const found = new Set(result.rows.map((row) => row.table_name));
  const missing = REQUIRED_TABLES.filter((name) => !found.has(name));
  if (missing.length) {
    throw new Error(`[HEALTHCHECK_FAILED] Missing tables: ${missing.join(', ')}`);
  }

  logger.info('Healthcheck passed', { tables: REQUIRED_TABLES.length });
}

module.exports = { runDbInit, runHealthcheck };

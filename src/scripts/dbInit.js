const fs = require('fs');
const path = require('path');
const { pool } = require('../db/pool');

(async () => {
  try {
    const sqlPath = path.join(__dirname, '../../sql/init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    await pool.query(sql);
    console.log('DB init completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('DB init failed:', error.message);
    process.exit(1);
  }
})();

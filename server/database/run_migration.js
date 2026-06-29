// server/database/run_migration.js
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function runMigration() {
  console.log('[Migration] Running migrate_leaves.sql...');
  
  const config = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'kcm_database',
    multipleStatements: true
  };

  let connection;
  try {
    connection = await mysql.createConnection(config);
    console.log('[Migration] Connected to database.');

    const sqlPath = path.join(__dirname, 'migrate_leaves.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    await connection.query(sql);
    console.log('[Migration] Leaves table created/verified successfully.');

    await connection.end();
    console.log('[Migration] Done!');
    process.exit(0);
  } catch (err) {
    console.error('[Migration] ERROR running migration:', err);
    if (connection) {
      try {
        await connection.end();
      } catch (e) {}
    }
    process.exit(1);
  }
}

runMigration();

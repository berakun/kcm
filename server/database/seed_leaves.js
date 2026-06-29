// server/database/seed_leaves.js
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function seedLeaves() {
  console.log('[Seed Leaves] Seeding test leave requests...');
  
  const config = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'kcm_database'
  };

  let connection;
  try {
    connection = await mysql.createConnection(config);
    console.log('[Seed Leaves] Connected to database.');

    // Clear existing leaves if any
    await connection.query('DELETE FROM leaves');

    // Find users budi and dewi
    const [budi] = await connection.query("SELECT id FROM users WHERE username = 'budi'");
    const [dewi] = await connection.query("SELECT id FROM users WHERE username = 'dewi'");

    if (budi.length === 0 || dewi.length === 0) {
      console.log('[Seed Leaves] Budi or dewi not found in database. Please run seeder first.');
      process.exit(1);
    }

    const budiId = budi[0].id;
    const dewiId = dewi[0].id;

    // 1. Pending leave for budi (to test Dashboard approval list)
    await connection.query(
      `INSERT INTO leaves (user_id, start_date, end_date, reason, status) 
       VALUES (?, '2026-07-10', '2026-07-12', 'Ada acara keluarga di luar kota', 'pending')`,
      [budiId]
    );
    console.log('[Seed Leaves] Inserted pending leave for Budi.');

    // 2. Approved leave for dewi (to test automatic payslip integration for June 2026)
    // Note: 2026-06-15 to 2026-06-17 = 3 days of approved leave
    await connection.query(
      `INSERT INTO leaves (user_id, start_date, end_date, reason, status) 
       VALUES (?, '2026-06-15', '2026-06-17', 'Sakit, butuh istirahat total', 'approved')`,
      [dewiId]
    );
    console.log('[Seed Leaves] Inserted approved leave for Dewi (June 2026, 3 days).');

    await connection.end();
    console.log('[Seed Leaves] Seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('[Seed Leaves] ERROR running seeder:', err);
    if (connection) {
      try {
        await connection.end();
      } catch (e) {}
    }
    process.exit(1);
  }
}

seedLeaves();

// Migration: Add 'type' column to attendance table
const db = require('../config/db');

(async () => {
  try {
    const [cols] = await db.query("SHOW COLUMNS FROM attendance LIKE 'type'");
    if (cols.length === 0) {
      await db.query("ALTER TABLE attendance ADD COLUMN type ENUM('check_in','izin','cuti','libur_tahunan') DEFAULT 'check_in' AFTER status");
      console.log('Added type column to attendance table');
    } else {
      console.log('type column already exists');
    }
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  }
})();

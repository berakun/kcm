const db = require('../config/db');
const bcrypt = require('bcryptjs');

async function reset() {
  try {
    console.log('[Reset] Connecting to database...');
    const passwordHash = await bcrypt.hash('password123', 10);
    
    console.log('[Reset] Hashed password123 successfully.');

    // We update passwords and make sure status is 'active' for the seed accounts
    const seedUsernames = ['superadmin', 'admin', 'budi', 'dewi', 'eko'];
    
    for (const username of seedUsernames) {
      const [rows] = await db.query('SELECT id, name FROM users WHERE username = ?', [username]);
      if (rows.length > 0) {
        await db.query('UPDATE users SET password = ?, status = "active" WHERE username = ?', [passwordHash, username]);
        console.log(`[Reset] Updated password and status to active for: ${username} (${rows[0].name})`);
      } else {
        console.log(`[Reset] User not found: ${username}`);
      }
    }
    
    console.log('[Reset] Password reset complete!');
    process.exit(0);
  } catch (err) {
    console.error('[Reset] Error resetting passwords:', err);
    process.exit(1);
  }
}

reset();

const mysql = require('mysql2');

async function test() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    database: 'kcm_database'
  });
  const db = connection.promise();

  const startDate = '2026-06-01';
  const endDate = '2026-06-30';
  const userId = 2; // Rina Wati

  console.log('Querying database for Rina Wati (user_id = 2)...');
  const [rows] = await db.query(
    'SELECT * FROM attendance WHERE user_id = ? AND date BETWEEN ? AND ? ORDER BY date DESC',
    [userId, startDate, endDate]
  );

  console.log(`Found ${rows.length} logs for Rina Wati.`);

  // Mimic serialization to JSON that happens over HTTP
  const logs = JSON.parse(JSON.stringify(rows));
  if (logs.length > 0) {
    console.log('Sample log:', logs[0]);
  }

  const normalLogs = logs.filter(l => !l.type || l.type === 'check_in');
  const hadirLengkap = normalLogs.filter(l => l.check_in && l.check_out).length;
  const absenSetengah = normalLogs.filter(l => l.check_in && !l.check_out).length;
  const daysWithAnyRecord = new Set(logs.map(l => l.date)).size;

  console.log({
    totalWorkingDays: 26,
    hadirLengkap,
    absenSetengah,
    daysWithAnyRecord
  });

  // Calculate terlambat
  const terlambat = normalLogs.filter(l => {
    if (!l.check_in) return false;
    const t = l.check_in.includes(' ') ? l.check_in.split(' ')[1] : l.check_in;
    const parts = t.split(':');
    const h = parseInt(parts[0]);
    const m = parseInt(parts[1]);
    return h > 8 || (h === 8 && m > 15);
  }).length;

  console.log('Terlambat count:', terlambat);

  connection.end();
}

test().catch(console.error);

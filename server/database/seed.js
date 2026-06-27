// server/database/seed.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    console.log('[Seeder] Starting database seeding...');

    // Skip if users already exist (idempotent — don't truncate on restart)
    const [existing] = await db.query('SELECT COUNT(*) as cnt FROM users');
    if (existing[0].cnt > 0) {
      console.log('[Seeder] Database already seeded (' + existing[0].cnt + ' users). Skipping.');
      return;
    }

    // First run only: truncate and seed everything
    await db.query('SET FOREIGN_KEY_CHECKS = 0');
    await db.query('TRUNCATE TABLE financial_reports');
    await db.query('TRUNCATE TABLE office_settings');
    await db.query('TRUNCATE TABLE attendance');
    await db.query('TRUNCATE TABLE cashbon');
    await db.query('TRUNCATE TABLE rembes');
    await db.query('TRUNCATE TABLE rab_items');
    await db.query('TRUNCATE TABLE rab');
    await db.query('TRUNCATE TABLE portfolio');
    await db.query('TRUNCATE TABLE users');
    await db.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('[Seeder] Cleared existing tables.');

    // 1. Seed Users
    const passwordHash = await bcrypt.hash('password123', 10);
    const users = [
      ['Ahmad Kurnia', 'superadmin', passwordHash, '085868000012', 'super_admin', 'Management', 'active'],
      ['Rina Wati', 'admin', passwordHash, '081234567890', 'admin', 'Project', 'active'],
      ['Budi Santoso', 'budi', passwordHash, '085712345678', 'staff', 'Desain', 'active'],
      ['Dewi Lestari', 'dewi', passwordHash, '082134567891', 'staff', 'Desain', 'active'],
      ['Eko Prasetyo', 'eko', passwordHash, '083456789012', 'staff', 'Proyek', 'active']
    ];

    for (const u of users) {
      await db.query(
        'INSERT INTO users (name, username, password, phone, role, department, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        u
      );
    }
    console.log('[Seeder] Seeded 5 users.');

    // 2. Seed Portfolio
    const portfolios = [
      ['Villa Modern Jogja', 'residential', 'Desain interior modern minimalis untuk villa di Sleman. Menggunakan material kayu jati dan batu alam.', 'Budi Hartono', 'Sleman, Yogyakarta', 2024, '["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80", "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80"]', 'published'],
      ['Kantor Startup Tech', 'office', 'Renovasi kantor startup dengan konsep open space. Warna dominan putih dengan aksen kayu.', 'PT Tech Indonesia', 'Jakarta Selatan', 2024, '["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"]', 'published'],
      ['Hotel Heritage Jogja', 'hotel', 'Redesain lobby dan 20 kamar hotel heritage bergaya Jawa modern.', 'Hotel Tugu', 'Malioboro, Yogyakarta', 2023, '["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80", "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80"]', 'published'],
      ['Kost Eksklusif Mahasiswa', 'kost', 'Pembangunan 15 unit kost eksklusif dengan furnished lengkap.', 'Andi Wijaya', 'Universitas Sanata Dharma', 2024, '["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80"]', 'published'],
      ['RS Mitra Keluarga', 'rumah_sakit', 'Renovasi ruang tunggu dan 5 ruang rawat inap dengan desain healing environment.', 'RS Mitra Keluarga', 'Sleman, Yogyakarta', 2023, '["https://images.unsplash.com/photo-1586773860418-d3b3de97e663?w=800&q=80", "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80"]', 'published'],
      ['Rumah Minimalis 2 Lantai', 'residential', 'Desain interior lengkap rumah 120m2 2 lantai. Gaya Scandinavian modern.', 'Keluarga Raharjo', 'Bantul, Yogyakarta', 2024, '["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80"]', 'published'],
      ['Co-working Space KCM', 'office', 'Desain co-working space untuk komunitas kreatif. Industrial style dengan exposed brick.', 'Komunitas Kreatif Jogja', 'Tugu, Yogyakarta', 2024, '["https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&q=80", "https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=800&q=80"]', 'published'],
      ['Restoran Padang Modern', 'hotel', 'Renovasi restoran Padang dengan konsep modern tradisional.', 'RM Sederhana', 'Gejayan, Yogyakarta', 2023, '["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"]', 'draft']
    ];

    for (const p of portfolios) {
      await db.query(
        'INSERT INTO portfolio (title, category, description, client_name, location, year, images, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        p
      );
    }
    console.log('[Seeder] Seeded 8 portfolios.');

    // 3. Seed RAB
    const rabs = [
      ['KCM-RAB-2025-001', 'Villa Modern Jogja', 'Budi Hartono', '2025-01-15', 'selesai', 850000000, 1],
      ['KCM-RAB-2025-002', 'Kantor Startup Tech', 'PT Tech Indonesia', '2025-02-20', 'dikerjakan', 450000000, 1],
      ['KCM-RAB-2025-003', 'Kost Eksklusif Mahasiswa', 'Andi Wijaya', '2025-03-10', 'dikerjakan', 620000000, 1],
      ['KCM-RAB-2025-004', 'Rumah Minimalis 2 Lantai', 'Keluarga Raharjo', '2025-04-01', 'draft', 380000000, 1]
    ];

    for (const r of rabs) {
      await db.query(
        'INSERT INTO rab (code, project_name, client, date, status, total_budget, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
        r
      );
    }
    console.log('[Seeder] Seeded 4 RABs.');

    // 4. Seed RAB Items
    const rabItems = [
      // RAB 1: Villa Modern
      [1, 'bahan', 'Cat Tembok Dulux', 'Cat tembok premium warna putih', 'kg', 150, 85000],
      [1, 'bahan', 'Keramik Lantai 60x60', 'Keramik granit motif marble', 'm2', 200, 175000],
      [1, 'bahan', 'Panel Gypsum', 'Plafon gypsum 9mm', 'm2', 180, 85000],
      [1, 'bahan', 'Kayu Jati Jepara', 'Pintu & furniture kayu jati', 'm3', 2.5, 45000000],
      [1, 'bahan', 'Batu Alam Andesit', 'Wall cladding batu alam', 'm2', 45, 350000],
      [1, 'pekerjaan', 'Tukang Bangunan', 'Upah tukang harian', 'hari', 120, 350000],
      [1, 'pekerjaan', 'Tukang Kayu', 'Spesialis furniture custom', 'hari', 80, 400000],
      [1, 'pekerjaan', 'Instalasi Listrik', 'Pekerjaan instalasi kabel & lampu', 'point', 25, 250000],
      [1, 'pekerjaan', 'Plumbing', 'Instalasi air bersih & kotor', 'point', 15, 300000],
      [1, 'perlengkapan', 'Lampu LED Downlight', 'Lampu LED 12W', 'pcs', 40, 125000],
      [1, 'perlengkapan', 'Stop Kontak', 'Stop kontak Panasonic', 'pcs', 30, 45000],
      [1, 'perlengkapan', 'Kran Air', 'Kran shower & wastafel', 'pcs', 8, 350000],

      // RAB 2: Kantor Startup
      [2, 'bahan', 'Cat Tembok Nippon', 'Cat anti bakteri warna white', 'kg', 80, 95000],
      [2, 'bahan', 'Vinyl Lantai', 'Vinyl plank wood pattern', 'm2', 150, 125000],
      [2, 'bahan', 'Partisi Kaca', 'Partisi tempered glass 10mm', 'm2', 40, 850000],
      [2, 'pekerjaan', 'Tukang Bangunan', 'Renovasi & finishing', 'hari', 60, 350000],
      [2, 'pekerjaan', 'Instalasi Listrik', 'Kabel LAN & power outlet', 'point', 40, 200000],
      [2, 'perlengkapan', 'Meja Kerja', 'Meja standing desk elektrik', 'pcs', 15, 2500000],
      [2, 'perlengkapan', 'Kursi Ergonomis', 'Kursi kerja ergonomic', 'pcs', 15, 1800000],

      // RAB 3: Kost Eksklusif
      [3, 'bahan', 'Cat Tembok', 'Cat tembok washable', 'kg', 200, 75000],
      [3, 'bahan', 'Keramik Lantai', 'Keramik 40x40', 'm2', 300, 95000],
      [3, 'bahan', 'Besi Beton', 'Beton tulangan 10mm', 'kg', 500, 14000],
      [3, 'pekerjaan', 'Tukang Bangunan', 'Pembangunan 15 unit', 'hari', 200, 300000],
      [3, 'pekerjaan', 'Tukang Kayu', 'Furniture built-in', 'hari', 50, 380000],
      [3, 'perlengkapan', 'Spring Bed Single', 'Kasur 90x200', 'pcs', 15, 850000],
      [3, 'perlengkapan', 'Lemari Pakaian', 'Lemari 2 pintu', 'pcs', 15, 750000],

      // RAB 4: Rumah Minimalis
      [4, 'bahan', 'Cat Tembok', 'Cat premium putih susu', 'kg', 100, 85000],
      [4, 'bahan', 'Lantai Parket', 'Parket vinyl anti air', 'm2', 120, 165000],
      [4, 'pekerjaan', 'Tukang Interior', 'Pemasangan semua furniture', 'hari', 45, 350000]
    ];

    for (const ri of rabItems) {
      await db.query(
        'INSERT INTO rab_items (rab_id, section, item_name, description, unit, qty, unit_price) VALUES (?, ?, ?, ?, ?, ?, ?)',
        ri
      );
    }
    console.log('[Seeder] Seeded RAB items.');

    // 5. Seed Rembes
    const rembes = [
      [1, '2025-03-15', 'Kayu Jati naik harga', 112500000, 125000000, 'Supplier naikkan harga 11%', 'melebihi'],
      [1, '2025-04-01', 'Pekerjaan tambah 10 hari', 42000000, 45500000, 'Keterlambatan material', 'waspada'],
      [2, '2025-04-10', 'Partisi kaca lebih mahal', 34000000, 36000000, 'Desain berubah sedikit', 'waspada'],
      [2, '2025-04-20', 'Meja standing desk', 37500000, 37500000, 'Sesuai anggaran', 'aman'],
      [3, '2025-05-01', 'Besi beton naik', 7000000, 7350000, 'Harga material naik 5%', 'aman']
    ];

    for (const rem of rembes) {
      await db.query(
        'INSERT INTO rembes (rab_id, date, description, rab_amount, actual_amount, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        rem
      );
    }
    console.log('[Seeder] Seeded 5 rembes logs.');

    // 6. Seed Cashbon
    const cashbons = [
      [3, '2025-04-05', 'Toko Bangunan Jaya', 'Pembelian cat & keramik villa', 25000000, 'approved', 'Cashbon proyek villa'],
      [3, '2025-04-10', 'Supplier Partisi', 'DP partisi kaca kantor', 15000000, 'approved', 'DP 50% partisi'],
      [4, '2025-04-15', 'Toko Mebel', 'Pembelian meja kerja', 18000050, 'pending', 'Menunggu approval'],
      [3, '2025-05-01', 'Kurir Material', 'Ongkos kirim material', 2500000, 'approved', 'Ongkir villa Jogja'],
      [4, '2025-05-10', 'Toko Elektronik', 'Pembelian lampu LED', 5000000, 'rejected', 'Melebihi budget']
    ];

    for (const c of cashbons) {
      await db.query(
        'INSERT INTO cashbon (user_id, date, recipient, description, amount, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
        c
      );
    }
    console.log('[Seeder] Seeded 5 cashbon records.');

    // 7. Seed Attendance for 5 Users (May & June 2026)
    console.log('[Seeder] Seeding attendance for 5 users (May & June 2026)...');
    
    // We get the 5 original users (id 1 to 5)
    const targetUsers = [1, 2, 3, 4, 5];
    
    const attendancePeriods = [
      {
        year: 2026,
        month: 5,
        days: [1, 2, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30]
      },
      {
        year: 2026,
        month: 6,
        days: [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 22, 23, 24, 25, 26, 27, 29, 30]
      }
    ];

    // Helper to calculate duration for seed
    function getDurationForSeed(inStr, outStr) {
      if (!outStr) return null;
      const diffMs = new Date(outStr) - new Date(inStr);
      const diffHrs = Math.floor(diffMs / 3600000);
      const diffMins = Math.floor((diffMs % 3600000) / 60000);
      const diffSecs = Math.floor((diffMs % 60000) / 1000);
      return [
        diffHrs.toString().padStart(2, '0'),
        diffMins.toString().padStart(2, '0'),
        diffSecs.toString().padStart(2, '0')
      ].join(':');
    }

    let attendanceCount = 0;
    for (const period of attendancePeriods) {
      for (const userId of targetUsers) {
        for (let idx = 0; idx < period.days.length; idx++) {
          const day = period.days[idx];
          const dateStr = `${period.year}-${period.month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          
          // 2 days absent: no records inserted
          if (idx === 8 || idx === 18) {
            continue;
          }
          
          // 1 day cuti, 1 day izin
          if (idx === 4) {
            // cuti
            await db.query(
              'INSERT INTO attendance (user_id, check_in, check_out, latitude, longitude, distance, status, ip_address, date, duration, type) VALUES (?, null, null, null, null, null, "di_kantor", "192.168.1.10", ?, null, "cuti")',
              [userId, dateStr]
            );
            attendanceCount++;
            continue;
          }
          if (idx === 14) {
            // izin
            await db.query(
              'INSERT INTO attendance (user_id, check_in, check_out, latitude, longitude, distance, status, ip_address, date, duration, type) VALUES (?, null, null, null, null, null, "di_kantor", "192.168.1.10", ?, null, "izin")',
              [userId, dateStr]
            );
            attendanceCount++;
            continue;
          }
          
          // Present days
          // On time: <= 08:00 (approx 35%) -> idx % 3 === 0
          let inHour = 8;
          let inMin = 0;
          if (idx % 3 === 0) {
            inHour = 7;
            inMin = 50 + (idx % 10); // 07:50 - 07:59
          } else {
            inHour = 8;
            inMin = 1 + (idx % 19); // 08:01 - 08:19
          }
          
          const inTime = `${inHour.toString().padStart(2, '0')}:${inMin.toString().padStart(2, '0')}`;
          const outTime = '17:05';
          
          const checkIn = `${dateStr} ${inTime}:00`;
          const checkOut = `${dateStr} ${outTime}:00`;
          const duration = getDurationForSeed(checkIn, checkOut);
          
          // Generate realistic GPS and distance
          const lat = -7.7326 + (Math.random() * 0.0002 - 0.0001);
          const lng = 110.3988 + (Math.random() * 0.0002 - 0.0001);
          const distance = Math.round((3 + Math.random() * 15) * 10) / 10; // 3m - 18m from office
          
          await db.query(
            'INSERT INTO attendance (user_id, check_in, check_out, latitude, longitude, distance, status, ip_address, date, duration, type) VALUES (?, ?, ?, ?, ?, ?, "di_kantor", "192.168.1.10", ?, ?, "check_in")',
            [userId, checkIn, checkOut, lat, lng, distance, dateStr, duration]
          );
          attendanceCount++;
        }
      }
    }
    console.log(`[Seeder] Seeded ${attendanceCount} attendance records for May & June 2026.`);

    // 8. Seed Financial Reports
    const financials = [
      ['2025-01', 150000000, 98000000, 72.5],
      ['2025-02', 180000000, 120000000, 75.0],
      ['2025-03', 220000000, 165000000, 78.3],
      ['2025-04', 195000000, 140000000, 76.8],
      ['2025-05', 250000000, 185000000, 82.1],
      ['2025-06', 280000000, 195000000, 79.5]
    ];

    for (const f of financials) {
      await db.query(
        'INSERT INTO financial_reports (period, revenue, expenses, utilization) VALUES (?, ?, ?, ?)',
        f
      );
    }
    console.log('[Seeder] Seeded 6 months financial reports.');

    // 9. Seed Office Settings
    await db.query(
      "INSERT INTO office_settings (setting_key, setting_value) VALUES ('office_latitude', '-7.7326'), ('office_longitude', '110.3988'), ('office_radius', '20') ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)"
    );
    console.log('[Seeder] Seeded office settings.');

    console.log('[SUCCESS] Database seeding completed successfully!');
  } catch (err) {
    console.error('[ERROR] Seeding failed:', err.message);
  }
}

// Task 7: Seed May 2026 attendance data
async function seedAttendanceMay() {
  try {
    console.log('[Seeder] Seeding May 2026 attendance...');

    // Check if May 2026 attendance already exists
    const [existing] = await db.query(
      "SELECT COUNT(*) as cnt FROM attendance WHERE date BETWEEN '2026-05-01' AND '2026-05-31'"
    );
    if (existing[0].cnt > 0) {
      console.log(`[Seeder] May 2026 attendance already exists (${existing[0].cnt} records). Skipping.`);
      return;
    }

    // Get staff users (budi=3, dewi=4, eko=5)
    const [users] = await db.query("SELECT id, username FROM users WHERE role = 'staff' ORDER BY id");
    if (users.length === 0) {
      console.log('[Seeder] No staff users found. Run main seed first.');
      return;
    }
    console.log(`[Seeder] Found ${users.length} staff users: ${users.map(u => u.username).join(', ')}`);

    // Generate working days for May 2026 (Mon-Sat)
    const workingDays = [];
    for (let day = 1; day <= 31; day++) {
      const date = new Date(2026, 4, day); // May = month index 4
      const dow = date.getDay(); // 0=Sun, 6=Sat
      if (dow === 0) continue; // Skip Sunday
      const dateStr = `2026-05-${String(day).padStart(2, '0')}`;
      workingDays.push({ date: dateStr, day, dow });
    }
    console.log(`[Seeder] May 2026 has ${workingDays.length} working days (Mon-Sat).`);

    // Special scenario assignments per user
    // For each user: 2 days only check_in (absenSetengah), 1 day late, 2 days missing (tidakHadir)
    const scenarios = users.map((u, idx) => {
      const shuffled = [...workingDays].sort(() => Math.random() - 0.5);
      const missingDays = new Set(shuffled.slice(0, 2).map(d => d.date));     // 2 days absent
      const incompleteDays = new Set(shuffled.slice(2, 4).map(d => d.date));  // 2 days check_in only
      const lateDay = shuffled[4].date;                                        // 1 day late check_in
      return { userId: u.id, username: u.username, missingDays, incompleteDays, lateDay };
    });

    const records = [];

    for (const user of users) {
      const sc = scenarios.find(s => s.userId === user.id);

      for (const wd of workingDays) {
        // Skip missing days (tidakHadir scenario)
        if (sc.missingDays.has(wd.date)) {
          continue; // No record at all
        }

        // Random check-in between 07:50 and 08:20
        const inMin = Math.floor(Math.random() * 30) + 470; // 470=7:50, 500=8:20
        let inH = Math.floor(inMin / 60);
        let inM = inMin % 60;

        // Late scenario: force check-in after 08:15
        if (sc.lateDay === wd.date) {
          inH = 8;
          inM = Math.floor(Math.random() * 30) + 16; // 08:16 to 08:45
        }

        const checkIn = `${wd.date} ${String(inH).padStart(2, '0')}:${String(inM).padStart(2, '0')}:00`;

        // Random check-out between 16:45 and 17:15
        let checkOut = null;
        if (!sc.incompleteDays.has(wd.date)) {
          const outMin = Math.floor(Math.random() * 30) + 1005; // 1005=16:45, 1035=17:15
          const outH = Math.floor(outMin / 60);
          const outM = outMin % 60;
          checkOut = `${wd.date} ${String(outH).padStart(2, '0')}:${String(outM).padStart(2, '0')}:00`;
        }

        // Duration
        let duration = null;
        if (checkOut) {
          const ciMin = inH * 60 + inM;
          const coMin = parseInt(checkOut.split(' ')[1].split(':')[0]) * 60 + parseInt(checkOut.split(' ')[1].split(':')[1]);
          const dur = coMin - ciMin;
          const dh = Math.floor(dur / 60);
          const dm = dur % 60;
          duration = `${String(dh).padStart(2, '0')}:${String(dm).padStart(2, '0')}:00`;
        }

        const lat = -7.7326 + (Math.random() * 0.001 - 0.0005);
        const lng = 110.3988 + (Math.random() * 0.001 - 0.0005);
        const dist = Math.round((Math.random() * 15 + 1) * 10) / 10;
        const status = 'di_kantor';
        const ip = `192.168.100.${50 + user.id}`;

        records.push([user.id, checkIn, checkOut, lat, lng, dist, status, ip, wd.date, 'check_in', duration]);
      }
    }

    console.log(`[Seeder] Inserting ${records.length} attendance records for May 2026...`);

    for (const r of records) {
      await db.query(
        'INSERT INTO attendance (user_id, check_in, check_out, latitude, longitude, distance, status, ip_address, date, type, duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        r
      );
    }

    // Print summary
    for (const sc of scenarios) {
      const u = users.find(u => u.id === sc.userId);
      console.log(`  ${u.username}: ${sc.missingDays.size} absent, ${sc.incompleteDays.size} incomplete, 1 late`);
    }
    console.log(`[Seeder] May 2026 attendance seeded successfully!`);
  } catch (err) {
    console.error('[ERROR] Seeding May attendance failed:', err.message);
    throw err;
  }
}

// Seed attendance for ALL users across April, May, June 2026
async function seedAttendanceFull() {
  try {
    console.log('[Seeder] Seeding April-June 2026 attendance for ALL users...');

    const [users] = await db.query("SELECT id, username, role FROM users ORDER BY id");
    if (users.length === 0) {
      console.log('[Seeder] No users found. Run main seed first.');
      return;
    }

    const months = [
      { year: 2026, month: 4, label: 'April 2026' },   // month index 3 = April
      { year: 2026, month: 5, label: 'Mei 2026' },     // month index 4 = May
      { year: 2026, month: 6, label: 'Juni 2026', maxDay: 26 }  // month index 5 = June, up to today
    ];

    for (const m of months) {
      // Check existing
      const [existing] = await db.query(
        `SELECT COUNT(*) as cnt FROM attendance WHERE date BETWEEN ? AND ?`,
        [`${m.year}-${String(m.month).padStart(2,'0')}-01`,
         `${m.year}-${String(m.month).padStart(2,'0')}-${String(m.maxDay || 30).padStart(2,'0')}`]
      );
      if (existing[0].cnt > 0) {
        console.log(`[Seeder] ${m.label} already has ${existing[0].cnt} records. Skipping.`);
        continue;
      }

      const maxDay = m.maxDay || new Date(m.year, m.month, 0).getDate();

      // Working days (Mon-Sat)
      const workingDays = [];
      for (let day = 1; day <= maxDay; day++) {
        const date = new Date(m.year, m.month - 1, day);
        if (date.getDay() === 0) continue; // Skip Sunday
        workingDays.push({ date: `${m.year}-${String(m.month).padStart(2,'0')}-${String(day).padStart(2,'0')}`, day });
      }

      const records = [];
      for (const user of users) {
        // Each user gets: ~3 days absent, ~3 days incomplete (check-in only), ~1 day late
        const shuffled = [...workingDays].sort(() => Math.random() - 0.5);
        const missing = new Set(shuffled.slice(0, 3).map(d => d.date));
        const incomplete = new Set(shuffled.slice(3, 6).map(d => d.date));
        const lateDay = shuffled[6]?.date;

        for (const wd of workingDays) {
          if (missing.has(wd.date)) continue;

          // Check-in
          let inH = 7, inM = Math.floor(Math.random() * 25) + 50; // 07:50-08:15
          if (inM >= 60) { inH = 8; inM -= 60; }
          if (lateDay === wd.date) { inH = 8; inM = Math.floor(Math.random() * 30) + 16; }

          const checkIn = `${wd.date} ${String(inH).padStart(2,'0')}:${String(inM).padStart(2,'0')}:00`;

          let checkOut = null;
          if (!incomplete.has(wd.date)) {
            const outMin = Math.floor(Math.random() * 30) + 1005; // 16:45-17:15
            checkOut = `${wd.date} ${String(Math.floor(outMin/60)).padStart(2,'0')}:${String(outMin%60).padStart(2,'0')}:00`;
          }

          let duration = null;
          if (checkOut) {
            const ciMin = inH * 60 + inM;
            const coMin = parseInt(checkOut.split(' ')[1].split(':')[0]) * 60 + parseInt(checkOut.split(' ')[1].split(':')[1]);
            const dur = coMin - ciMin;
            duration = `${String(Math.floor(dur/60)).padStart(2,'0')}:${String(dur%60).padStart(2,'0')}:00`;
          }

          const lat = -7.7326 + (Math.random() * 0.001 - 0.0005);
          const lng = 110.3988 + (Math.random() * 0.001 - 0.0005);
          const dist = Math.round((Math.random() * 15 + 1) * 10) / 10;

          records.push([user.id, checkIn, checkOut, lat, lng, dist, 'di_kantor', `192.168.100.${50 + user.id}`, wd.date, 'check_in', duration]);
        }
      }

      if (records.length > 0) {
        console.log(`[Seeder] Inserting ${records.length} attendance records for ${m.label}...`);
        for (const r of records) {
          await db.query(
            'INSERT INTO attendance (user_id, check_in, check_out, latitude, longitude, distance, status, ip_address, date, type, duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            r
          );
        }
      }
      console.log(`[Seeder] ${m.label} seeded!`);
    }
    console.log('[Seeder] All attendance seeded successfully!');
  } catch (err) {
    console.error('[ERROR] Seeding attendance failed:', err.message);
    throw err;
  }
}

module.exports = seed;
module.exports.seedAttendanceMay = seedAttendanceMay;
module.exports.seedAttendanceFull = seedAttendanceFull;

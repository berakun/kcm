const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Helper to format duration HH:MM:SS
function getDuration(inStr, outStr) {
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

async function forceSeed() {
  try {
    console.log('[Force Seeder] Creating tables if they do not exist...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS purchase_orders (
        id INT PRIMARY KEY AUTO_INCREMENT,
        po_number VARCHAR(50) UNIQUE NOT NULL,
        to_supplier VARCHAR(200),
        date DATE,
        phone VARCHAR(20),
        attn VARCHAR(100),
        rab_id INT,
        items JSON,
        projects TEXT,
        material_ref TEXT,
        total DECIMAL(15,2) DEFAULT 0,
        ppn DECIMAL(15,2) DEFAULT 0,
        grand_total DECIMAL(15,2) DEFAULT 0,
        in_words TEXT,
        note TEXT,
        deliver_by DATE,
        deliver_to VARCHAR(200),
        ordered_by VARCHAR(100),
        purchasing VARCHAR(100),
        prepared_by VARCHAR(100),
        approved_by VARCHAR(100) DEFAULT 'Anriko K, ST.',
        term_of_payment VARCHAR(200) DEFAULT 'Anriko K, ST.',
        status VARCHAR(20) DEFAULT 'draft',
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await db.query(`
      CREATE TABLE IF NOT EXISTS ongkos_tukang (
        id INT PRIMARY KEY AUTO_INCREMENT,
        rab_id INT NOT NULL,
        date DATE NOT NULL,
        description VARCHAR(255) NOT NULL,
        amount DECIMAL(15,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('[Force Seeder] Starting database truncation...');
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
    await db.query('TRUNCATE TABLE purchase_orders');
    await db.query('TRUNCATE TABLE ongkos_tukang');
    await db.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('[Force Seeder] Database truncated successfully.');

    const passwordHash = await bcrypt.hash('password123', 10);

    // 1. Seed 15 Users (5 Original + 10 Dummy)
    console.log('[Force Seeder] Seeding users...');
    const originalUsers = [
      ['Ahmad Kurnia', 'superadmin', passwordHash, '085868000012', 'super_admin', 'Management', 'active'],
      ['Rina Wati', 'admin', passwordHash, '081234567890', 'admin', 'Project', 'active'],
      ['Budi Santoso', 'budi', passwordHash, '085712345678', 'staff', 'Desain', 'active'],
      ['Dewi Lestari', 'dewi', passwordHash, '082134567891', 'staff', 'Desain', 'active'],
      ['Eko Prasetyo', 'eko', passwordHash, '083456789012', 'staff', 'Proyek', 'active']
    ];

    const dummyUsers = [];
    for (let i = 1; i <= 10; i++) {
      dummyUsers.push([
        `Staff Dummy ${i}`,
        `staff${i}`,
        passwordHash,
        `0899123456${i}`,
        'staff',
        i % 2 === 0 ? 'Desain' : 'Proyek',
        'active'
      ]);
    }

    const allUsers = [...originalUsers, ...dummyUsers];
    const userIds = [];
    for (const u of allUsers) {
      const [res] = await db.query(
        'INSERT INTO users (name, username, password, phone, role, department, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        u
      );
      userIds.push({ id: res.insertId, name: u[0], username: u[1], role: u[4] });
    }
    console.log(`[Force Seeder] Seeded ${userIds.length} users.`);

    // Set Rina Wati ID
    const rina = userIds.find(u => u.username === 'admin');
    const rinaId = rina ? rina.id : 2;

    // 2. Seed Settings
    console.log('[Force Seeder] Seeding office settings...');
    await db.query("INSERT INTO office_settings (setting_key, setting_value) VALUES ('office_latitude', '-7.7326')");
    await db.query("INSERT INTO office_settings (setting_key, setting_value) VALUES ('office_longitude', '110.3988')");
    await db.query("INSERT INTO office_settings (setting_key, setting_value) VALUES ('office_radius', '20')");

    // 3. Seed Attendance for 5 Users (May & June 2026)
    console.log('[Force Seeder] Seeding attendance for 5 users (May & June 2026)...');
    
    // We target the 5 original users
    const targetStaffs = userIds.filter(u => ['super_admin', 'admin', 'staff'].includes(u.role)).slice(0, 5);
    
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
    
    for (const period of attendancePeriods) {
      for (const user of targetStaffs) {
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
              [user.id, dateStr]
            );
            continue;
          }
          if (idx === 14) {
            // izin
            await db.query(
              'INSERT INTO attendance (user_id, check_in, check_out, latitude, longitude, distance, status, ip_address, date, duration, type) VALUES (?, null, null, null, null, null, "di_kantor", "192.168.1.10", ?, null, "izin")',
              [user.id, dateStr]
            );
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
          const duration = getDuration(checkIn, checkOut);
          
          // Generate realistic GPS and distance
          const lat = -7.7326 + (Math.random() * 0.0002 - 0.0001);
          const lng = 110.3988 + (Math.random() * 0.0002 - 0.0001);
          const distance = Math.round((3 + Math.random() * 15) * 10) / 10; // 3m - 18m from office
          
          await db.query(
            'INSERT INTO attendance (user_id, check_in, check_out, latitude, longitude, distance, status, ip_address, date, duration, type) VALUES (?, ?, ?, ?, ?, ?, "di_kantor", "192.168.1.10", ?, ?, "check_in")',
            [user.id, checkIn, checkOut, lat, lng, distance, dateStr, duration]
          );
        }
      }
    }
    console.log('[Force Seeder] Seeded attendance logs for 5 users successfully.');

    // 4. Seed 10 Dummy Portfolios
    console.log('[Force Seeder] Seeding 10 portfolios...');
    const categories = ['residential', 'office', 'hotel', 'kost', 'rumah_sakit'];
    for (let i = 1; i <= 10; i++) {
      const cat = categories[i % categories.length];
      await db.query(
        'INSERT INTO portfolio (title, category, description, client_name, location, year, images, status) VALUES (?, ?, ?, ?, ?, ?, ?, "published")',
        [
          `Proyek Interior Mewah ${i}`,
          cat,
          `Deskripsi lengkap proyek interior dummy ke-${i} yang memiliki desain estetis dan premium.`,
          `Klien Proyek ${i}`,
          `Sleman, Yogyakarta`,
          2024 - (i % 3),
          JSON.stringify(['/assets/images/hero-interior.jpg']),
        ]
      );
    }

    // 5. Seed 10 Dummy RABs
    console.log('[Force Seeder] Seeding 10 RABs and items...');
    const rabIds = [];
    for (let i = 1; i <= 10; i++) {
      const code = `KCM-RAB-2026-${i.toString().padStart(3, '0')}`;
      const status = i % 3 === 0 ? 'selesai' : (i % 3 === 1 ? 'dikerjakan' : 'draft');
      const [res] = await db.query(
        'INSERT INTO rab (code, project_name, client, date, status, total_budget, created_by) VALUES (?, ?, ?, ?, ?, 0, ?)',
        [
          code,
          `Renovasi Bangunan Utama ${i}`,
          `Klien RAB ${i}`,
          `2026-06-${(i + 2).toString().padStart(2, '0')}`,
          status,
          rinaId
        ]
      );
      const rabId = res.insertId;
      rabIds.push(rabId);

      // Seed 3 items for each RAB
      const items = [
        ['bahan', 'Semen Tiga Roda', 'Semen Portland berkualitas', 'sak', 20, 75000],
        ['pekerjaan', 'Upah Tukang Kayu', 'Custom furniture jati', 'hari', 5, 150000],
        ['perlengkapan', 'Lampu Hias Ruang Tamu', 'LED Warm White', 'pcs', 2, 250000]
      ];
      
      let totalBudget = 0;
      for (const item of items) {
        const qty = item[4];
        const price = item[5];
        totalBudget += (qty * price);
        await db.query(
          'INSERT INTO rab_items (rab_id, section, item_name, description, unit, qty, unit_price) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [rabId, item[0], item[1], item[2], item[3], qty, price]
        );
      }
      
      // Update the total budget
      await db.query('UPDATE rab SET total_budget = ? WHERE id = ?', [totalBudget, rabId]);
    }

    // 6. Seed 10 Dummy Rembes
    console.log('[Force Seeder] Seeding 10 rembes...');
    for (let i = 0; i < 10; i++) {
      const rabId = rabIds[i];
      await db.query(
        'INSERT INTO rembes (rab_id, date, description, rab_amount, actual_amount, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          rabId,
          `2026-06-${(i + 5).toString().padStart(2, '0')}`,
          `Beli material tambahan proyek ${i + 1}`,
          150000,
          175000, // Defisit/leakage
          `Ada kenaikan harga semen di toko bahan bangunan`,
          'melebihi'
        ]
      );
    }

    // 7. Seed 10 Dummy Cashbons
    console.log('[Force Seeder] Seeding 10 cashbons...');
    const staffs = userIds.filter(u => u.role === 'staff');
    for (let i = 1; i <= 10; i++) {
      const staff = staffs[i % staffs.length];
      await db.query(
        'INSERT INTO cashbon (user_id, date, recipient, description, amount, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          staff.id,
          `2026-06-${(i + 4).toString().padStart(2, '0')}`,
          staff.name,
          `Dana beli konsumsi tukang proyek ${i}`,
          125000,
          i % 2 === 0 ? 'approved' : 'pending',
          i % 2 === 0 ? 'Disetujui untuk operasional' : null
        ]
      );
    }

    // 8. Seed 10 Dummy Purchase Orders
    console.log('[Force Seeder] Seeding 10 POs...');
    for (let i = 0; i < 10; i++) {
      const rabId = rabIds[i];
      const items = [{ description: 'Besi Beton 10mm', qty: 10, satuan: 'batang', unitPrice: 95000 }];
      const total = 950000;
      const ppn = 95000;
      const grandTotal = total + ppn;
      await db.query(
        `INSERT INTO purchase_orders 
          (po_number, to_supplier, date, phone, attn, rab_id, items, projects, total, ppn, grand_total, status, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved', ?)`,
        [
          `B.803/KCM/VI/2026/0${i + 1}`,
          `Toko Besi Jaya Abadi ${i + 1}`,
          `2026-06-${(i + 3).toString().padStart(2, '0')}`,
          '08122334455',
          'Sales Manager',
          rabId,
          JSON.stringify(items),
          `Renovasi Bangunan Utama ${i + 1}`,
          total,
          ppn,
          grandTotal,
          rinaId
        ]
      );
    }

    // 9. Seed 10 Dummy Ongkos Tukang
    console.log('[Force Seeder] Seeding 10 ongkos tukang...');
    for (let i = 0; i < 10; i++) {
      const rabId = rabIds[i];
      await db.query(
        'INSERT INTO ongkos_tukang (rab_id, date, description, amount) VALUES (?, ?, ?, ?)',
        [
          rabId,
          `2026-06-${(i + 5).toString().padStart(2, '0')}`,
          `Ongkos tukang harian ke-${i + 1} proyek ${i + 1}`,
          350000
        ]
      );
    }

    // 10. Seed Financial Reports
    console.log('[Force Seeder] Seeding financial reports...');
    await db.query('INSERT INTO financial_reports (period, revenue, expenses, utilization) VALUES (?, ?, ?, ?)', ['Januari', 150000000, 95000000, 78.5]);
    await db.query('INSERT INTO financial_reports (period, revenue, expenses, utilization) VALUES (?, ?, ?, ?)', ['Februari', 180000000, 110000000, 82.0]);
    await db.query('INSERT INTO financial_reports (period, revenue, expenses, utilization) VALUES (?, ?, ?, ?)', ['Maret', 140000000, 105000000, 75.2]);
    await db.query('INSERT INTO financial_reports (period, revenue, expenses, utilization) VALUES (?, ?, ?, ?)', ['April', 220000000, 130000000, 88.4]);
    await db.query('INSERT INTO financial_reports (period, revenue, expenses, utilization) VALUES (?, ?, ?, ?)', ['Mei', 260000000, 145000000, 91.1]);
    await db.query('INSERT INTO financial_reports (period, revenue, expenses, utilization) VALUES (?, ?, ?, ?)', ['Juni', 310000000, 180000000, 94.6]);

    console.log('[Force Seeder] All 10 dummy data seeded successfully per table!');
    process.exit(0);
  } catch (err) {
    console.error('[Force Seeder] ERROR during seeding:', err);
    process.exit(1);
  }
}

forceSeed();

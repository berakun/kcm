// server/database/seed.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    console.log('[Seeder] Starting database seeding with dummy data v2...');

    // Disable foreign key checks to truncate tables
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

    // 7. Seed Attendance (2 months: May + June 2025)
    const attendances = [];
    // Generate attendance for May and June 2025, weekdays only
    const staffIds = [3, 4, 5]; // budi, dewi, eko
    const staffNames = { 3: 'Budi', 4: 'Dewi', 5: 'Eko' };
    
    for (let month = 5; month <= 6; month++) {
      const daysInMonth = new Date(2025, month, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(2025, month - 1, day);
        const dow = date.getDay(); // 0=Sun, 6=Sat
        if (dow === 0) continue; // Skip Sunday
        
        const dateStr = `2025-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        
        for (const uid of staffIds) {
          // Random: 85% chance present, 15% absent
          const present = Math.random() > 0.15;
          if (!present) {
            // Absent record
            attendances.push([uid, null, null, null, null, null, 'luar_kantor', null, dateStr]);
          } else {
            // Random check-in between 07:50 and 08:20
            const inMin = Math.floor(Math.random() * 30) + 470; // 470 = 7:50, 500 = 8:20
            const inH = Math.floor(inMin / 60);
            const inM = inMin % 60;
            const checkIn = `${dateStr} ${String(inH).padStart(2,'0')}:${String(inM).padStart(2,'0')}:00`;
            
            // Random check-out between 16:50 and 17:15
            const outMin = Math.floor(Math.random() * 25) + 1010; // 1010=16:50, 1035=17:15
            const outH = Math.floor(outMin / 60);
            const outM = outMin % 60;
            const checkOut = `${dateStr} ${String(outH).padStart(2,'0')}:${String(outM).padStart(2,'0')}:00`;
            
            const lat = -7.7326 + (Math.random() * 0.001 - 0.0005);
            const lng = 110.3988 + (Math.random() * 0.001 - 0.0005);
            const dist = Math.round((Math.random() * 15 + 1) * 10) / 10;
            const status = dist <= 20 ? 'di_kantor' : 'luar_kantor';
            const ip = `192.168.100.${50 + uid}`;
            
            attendances.push([uid, checkIn, checkOut, lat, lng, dist, status, ip, dateStr]);
          }
        }
      }
    }

    for (const a of attendances) {
      await db.query(
        'INSERT INTO attendance (user_id, check_in, check_out, latitude, longitude, distance, status, ip_address, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        a
      );
    }
    console.log(`[Seeder] Seeded ${attendances.length} attendance records (2 months).`);

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

module.exports = seed;

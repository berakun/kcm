// server/controllers/salary.controller.js — salary settings & employee overrides (DB-backed)
const db = require('../config/db');

// ─── Salary Settings (per role) ──────────────────────────────────

exports.getSettings = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM salary_settings ORDER BY FIELD(role_key, "super_admin", "admin", "staff", "_rates")');
    
    const settings = {};
    for (const row of rows) {
      settings[row.role_key] = {
        gajiPokok: row.gaji_pokok,
        makanTransport: row.makan_transport,
        tunjanganKesehatan: row.tunjangan_kesehatan,
        tunjanganJabatan: row.tunjangan_jabatan,
        tunjanganHariRaya: row.tunjangan_hari_raya,
        // rates (only meaningful for _rates)
        lemburJam: row.lembur_jam,
        lemburHari: row.lembur_hari,
        libur: row.libur_per_hari,
        terlambat: row.terlambat,
        absenSetengah: row.absen_setengah,
        tidakHadir: row.tidak_hadir
      };
    }
    return res.json(settings);
  } catch (err) {
    return res.status(500).json({ error: 'Gagal memuat pengaturan gaji: ' + err.message });
  }
};

exports.saveSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ error: 'Data tidak valid.' });
    }

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      for (const [roleKey, val] of Object.entries(settings)) {
        // Validate role key
        if (!['super_admin', 'admin', 'staff', '_rates'].includes(roleKey)) continue;

        const isRate = roleKey === '_rates';
        await conn.query(
          `INSERT INTO salary_settings (role_key, gaji_pokok, makan_transport, tunjangan_kesehatan, tunjangan_jabatan, tunjangan_hari_raya, lembur_jam, lembur_hari, libur_per_hari, terlambat, absen_setengah, tidak_hadir, updated_by)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
             gaji_pokok = VALUES(gaji_pokok),
             makan_transport = VALUES(makan_transport),
             tunjangan_kesehatan = VALUES(tunjangan_kesehatan),
             tunjangan_jabatan = VALUES(tunjangan_jabatan),
             tunjangan_hari_raya = VALUES(tunjangan_hari_raya),
             lembur_jam = VALUES(lembur_jam),
             lembur_hari = VALUES(lembur_hari),
             libur_per_hari = VALUES(libur_per_hari),
             terlambat = VALUES(terlambat),
             absen_setengah = VALUES(absen_setengah),
             tidak_hadir = VALUES(tidak_hadir),
             updated_by = VALUES(updated_by)`,
          [
            roleKey,
            val.gajiPokok || 0,
            val.makanTransport || 0,
            val.tunjanganKesehatan || 0,
            val.tunjanganJabatan || 0,
            val.tunjanganHariRaya || 0,
            val.lemburJam || 0,
            val.lemburHari || 0,
            val.libur || 0,
            val.terlambat || 0,
            val.absenSetengah || 0,
            val.tidakHadir || 0,
            req.user.id
          ]
        );
      }

      await conn.commit();
      return res.json({ success: true });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (err) {
    return res.status(500).json({ error: 'Gagal menyimpan pengaturan gaji: ' + err.message });
  }
};

// ─── Employee Overrides (per user) ───────────────────────────────

exports.getOverrides = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM employee_salary_overrides');
    const overrides = {};
    for (const row of rows) {
      overrides[row.user_id] = {
        gajiPokok: row.gaji_pokok,
        makanTransport: row.makan_transport,
        cuti: row.cuti,
        liburTahunan: row.libur_tahunan,
        tunjanganKesehatan: row.tunjangan_kesehatan,
        tunjanganJabatan: row.tunjangan_jabatan,
        tunjanganHariRaya: row.tunjangan_hari_raya
      };
    }
    return res.json(overrides);
  } catch (err) {
    return res.status(500).json({ error: 'Gagal memuat override gaji: ' + err.message });
  }
};

exports.saveOverrides = async (req, res) => {
  try {
    const { userId, data } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId wajib diisi.' });

    // Upsert
    await db.query(
      `INSERT INTO employee_salary_overrides (user_id, gaji_pokok, makan_transport, cuti, libur_tahunan, tunjangan_kesehatan, tunjangan_jabatan, tunjangan_hari_raya, updated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         gaji_pokok = VALUES(gaji_pokok),
         makan_transport = VALUES(makan_transport),
         cuti = VALUES(cuti),
         libur_tahunan = VALUES(libur_tahunan),
         tunjangan_kesehatan = VALUES(tunjangan_kesehatan),
         tunjangan_jabatan = VALUES(tunjangan_jabatan),
         tunjangan_hari_raya = VALUES(tunjangan_hari_raya),
         updated_by = VALUES(updated_by)`,
      [
        userId,
        data.gajiPokok ?? null,
        data.makanTransport ?? null,
        data.cuti ?? null,
        data.liburTahunan ?? null,
        data.tunjanganKesehatan ?? null,
        data.tunjanganJabatan ?? null,
        data.tunjanganHariRaya ?? null,
        req.user.id
      ]
    );

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal menyimpan override gaji: ' + err.message });
  }
};

exports.deleteOverride = async (req, res) => {
  try {
    const { userId } = req.params;
    await db.query('DELETE FROM employee_salary_overrides WHERE user_id = ?', [userId]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal menghapus override: ' + err.message });
  }
};

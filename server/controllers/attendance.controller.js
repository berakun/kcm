const db = require('../config/db');

function getJakartaDate() {
  const tzOffset = 7 * 60; // Jakarta is UTC+7
  const d = new Date();
  const localTime = d.getTime() + (d.getTimezoneOffset() + tzOffset) * 60000;
  const localDate = new Date(localTime);
  return localDate.toISOString().split('T')[0];
}

// Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

exports.getSettings = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT setting_key, setting_value FROM office_settings');
    const settings = {};
    rows.forEach(r => {
      settings[r.setting_key] = r.setting_value;
    });

    // Defaults
    if (!settings.office_latitude) settings.office_latitude = '-7.7326';
    if (!settings.office_longitude) settings.office_longitude = '110.3988';
    if (!settings.office_radius) settings.office_radius = '20';

    return res.json(settings);
  } catch (err) {
    return res.status(500).json({ error: 'Gagal mengambil setelan GPS: ' + err.message });
  }
};

exports.saveSettings = async (req, res) => {
  const { office_latitude, office_longitude, office_radius } = req.body;

  if (!office_latitude || !office_longitude) {
    return res.status(400).json({ error: 'Latitude dan longitude kantor wajib diisi.' });
  }

  try {
    await db.query(
      "INSERT INTO office_settings (setting_key, setting_value) VALUES ('office_latitude', ?) ON DUPLICATE KEY UPDATE setting_value = ?",
      [office_latitude, office_latitude]
    );
    await db.query(
      "INSERT INTO office_settings (setting_key, setting_value) VALUES ('office_longitude', ?) ON DUPLICATE KEY UPDATE setting_value = ?",
      [office_longitude, office_longitude]
    );
    await db.query(
      "INSERT INTO office_settings (setting_key, setting_value) VALUES ('office_radius', ?) ON DUPLICATE KEY UPDATE setting_value = ?",
      [office_radius || '20', office_radius || '20']
    );

    return res.json({ success: true, message: 'Setelan GPS kantor berhasil disimpan.' });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal menyimpan setelan GPS: ' + err.message });
  }
};

exports.getStatus = async (req, res) => {
  const today = getJakartaDate();
  try {
    const [rows] = await db.query(
      'SELECT * FROM attendance WHERE user_id = ? AND date = ? ORDER BY id DESC LIMIT 1',
      [req.user.id, today]
    );

    if (rows.length > 0) {
      return res.json({
        has_checked_in: true,
        has_checked_out: !!rows[0].check_out,
        data: rows[0]
      });
    } else {
      return res.json({
        has_checked_in: false,
        has_checked_out: false,
        data: null
      });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Gagal mengecek status presensi: ' + err.message });
  }
};

exports.getHistory = async (req, res) => {
  const userId = req.query.user_id || req.user.id;

  // Non-admins see only their own
  if (userId != req.user.id && !['admin', 'super_admin'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Akses ditolak.' });
  }

  try {
    const [rows] = await db.query(
      'SELECT * FROM attendance WHERE user_id = ? ORDER BY date DESC LIMIT 60',
      [userId]
    );
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: 'Gagal mengambil riwayat kehadiran: ' + err.message });
  }
};

exports.getAdminList = async (req, res) => {
  const { date, from, to } = req.query;

  try {
    let query = 'SELECT a.*, u.name as employee_name, u.department FROM attendance a JOIN users u ON a.user_id = u.id WHERE ';
    const params = [];

    if (from && to) {
      query += 'a.date >= ? AND a.date <= ?';
      params.push(from, to);
    } else {
      const d = date || new Date().toISOString().split('T')[0];
      query += 'a.date = ?';
      params.push(d);
    }

    query += ' ORDER BY a.date DESC, a.check_in ASC';
    const [rows] = await db.query(query, params);
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: 'Gagal mengambil rekap harian absensi: ' + err.message });
  }
};

exports.checkIn = async (req, res) => {
  const { latitude, longitude } = req.body;

  // Admin/super_admin can check in without GPS (from dashboard)
  const isAdminRole = ['admin', 'super_admin'].includes(req.user.role);

  if (!isAdminRole && (!latitude || !longitude)) {
    return res.status(400).json({ error: 'Koordinat GPS wajib disediakan.' });
  }

  const today = getJakartaDate();
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  try {
    // Check duplication
    const [check] = await db.query('SELECT id FROM attendance WHERE user_id = ? AND date = ?', [req.user.id, today]);
    if (check.length > 0) {
      return res.status(400).json({ error: 'Anda sudah check-in hari ini.' });
    }

    let distance = null;
    let status = 'di_kantor';
    let warning = null;

    if (latitude && longitude) {
      // Get GPS settings for distance calculation
      const [settingsRows] = await db.query('SELECT setting_key, setting_value FROM office_settings');
      const settings = {};
      settingsRows.forEach(r => settings[r.setting_key] = r.setting_value);

      const oLat = parseFloat(settings.office_latitude || '-7.7326');
      const oLng = parseFloat(settings.office_longitude || '110.3988');
      const oRad = parseFloat(settings.office_radius || '20');

      distance = calculateDistance(latitude, longitude, oLat, oLng);
      if (distance > oRad) {
        if (isAdminRole) {
          // Admin gets warning but still allowed to check in
          status = 'di_luar_kantor';
          warning = `Anda berada di luar radius kantor (${Math.round(distance)}m). Check-in tetap dicatat.`;
        } else {
          return res.status(400).json({ error: `Anda berada di luar radius kantor. Jarak Anda: ${Math.round(distance)} meter dari kantor` });
        }
      }
    }

    await db.query(
      'INSERT INTO attendance (user_id, check_in, latitude, longitude, distance, status, ip_address, date) VALUES (?, NOW(), ?, ?, ?, ?, ?, ?)',
      [req.user.id, latitude || null, longitude || null, distance, status, ip, today]
    );

    return res.json({
      success: true,
      message: warning || 'Check-in berhasil disimpan!',
      distance: Math.round(distance),
      status,
      warning
    });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal menyimpan check-in: ' + err.message });
  }
};

exports.checkOut = async (req, res) => {
  const { latitude, longitude } = req.body;

  // Admin/super_admin can check out without GPS (from dashboard)
  const isAdminRole = ['admin', 'super_admin'].includes(req.user.role);

  if (!isAdminRole && (!latitude || !longitude)) {
    return res.status(400).json({ error: 'Koordinat GPS wajib disediakan.' });
  }

  const today = getJakartaDate();
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  try {
    // Find checking today without check_out
    const [check] = await db.query(
      'SELECT id, check_in FROM attendance WHERE user_id = ? AND date = ? AND check_out IS NULL ORDER BY id DESC LIMIT 1',
      [req.user.id, today]
    );

    if (check.length === 0) {
      return res.status(400).json({ error: 'Anda belum check-in hari ini, atau sudah melakukan check-out.' });
    }

    let distance = null;
    let status = 'di_kantor';

    if (latitude && longitude) {
      const [settingsRows] = await db.query('SELECT setting_key, setting_value FROM office_settings');
      const settings = {};
      settingsRows.forEach(r => settings[r.setting_key] = r.setting_value);

      const oLat = parseFloat(settings.office_latitude || '-7.7326');
      const oLng = parseFloat(settings.office_longitude || '110.3988');
      const oRad = parseFloat(settings.office_radius || '20');

      distance = calculateDistance(latitude, longitude, oLat, oLng);
      // Admin diluar radius: tetap checkout, staff ditolak
      if (!isAdminRole && distance > oRad) {
        return res.status(400).json({ error: `Anda berada di luar radius kantor. Jarak Anda: ${Math.round(distance)} meter dari kantor` });
      }
    }

    // Calculate duration
    const checkInTime = new Date(check[0].check_in);
    const checkOutTime = new Date();
    const diffMs = checkOutTime - checkInTime;
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffMins = Math.floor((diffMs % 3600000) / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);
    const duration = [
      diffHrs.toString().padStart(2, '0'),
      diffMins.toString().padStart(2, '0'),
      diffSecs.toString().padStart(2, '0')
    ].join(':');

    await db.query(
      'UPDATE attendance SET check_out = NOW(), duration = ?, latitude = ?, longitude = ?, distance = ?, status = ?, ip_address = ? WHERE id = ?',
      [duration, latitude || null, longitude || null, distance, status, ip, check[0].id]
    );

    return res.json({
      success: true,
      message: 'Check-out berhasil disimpan!',
      duration,
      distance: Math.round(distance),
      status
    });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal menyimpan check-out: ' + err.message });
  }
};

exports.deleteAttendance = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM attendance WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Data presensi berhasil dihapus.' });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal menghapus data presensi: ' + err.message });
  }
};

exports.getRekap = async (req, res) => {
  const { start, end, user_id } = req.query;
  try {
    // 1. Fetch attendance logs
    let query = `SELECT a.*, u.name as employee_name, u.department 
                 FROM attendance a 
                 JOIN users u ON a.user_id = u.id 
                 WHERE a.date BETWEEN ? AND ?`;
    const params = [start, end];
    if (user_id) {
      query += ' AND a.user_id = ?';
      params.push(user_id);
    }
    query += ' ORDER BY a.date DESC, a.check_in DESC';
    const [rows] = await db.query(query, params);

    // 2. Fetch approved leaves overlapping with date range
    let leaveQuery = `SELECT l.*, u.name as employee_name, u.department
                      FROM leaves l
                      JOIN users u ON l.user_id = u.id
                      WHERE l.status = 'approved'
                        AND l.start_date <= ? AND l.end_date >= ?`;
    const leaveParams = [end, start];
    if (user_id) {
      leaveQuery += ' AND l.user_id = ?';
      leaveParams.push(user_id);
    }
    const [leaves] = await db.query(leaveQuery, leaveParams);

    // 3. Generate virtual attendance records for each leave day
    const leaveRecords = [];
    for (const leave of leaves) {
      const leaveStart = new Date(leave.start_date);
      const leaveEnd = new Date(leave.end_date);
      const rangeStart = new Date(start);
      const rangeEnd = new Date(end);

      // Bound to query range
      const boundStart = new Date(Math.max(leaveStart, rangeStart));
      const boundEnd = new Date(Math.min(leaveEnd, rangeEnd));

      for (let d = new Date(boundStart); d <= boundEnd; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        // Skip if attendance record already exists for this date
        const hasExisting = rows.some(r => r.user_id === leave.user_id && r.date === dateStr);
        if (!hasExisting) {
          leaveRecords.push({
            id: `leave-${leave.id}-${dateStr}`,
            user_id: leave.user_id,
            employee_name: leave.employee_name,
            department: leave.department,
            date: dateStr,
            check_in: null,
            check_out: null,
            duration: null,
            latitude: null,
            longitude: null,
            distance: null,
            status: 'di_kantor',
            type: 'cuti',
            ip_address: null,
            created_at: leave.created_at,
            leave_reason: leave.reason
          });
        }
      }
    }

    // 4. Merge and sort
    const allRecords = [...rows, ...leaveRecords].sort((a, b) => {
      const dateA = String(a.date || '');
      const dateB = String(b.date || '');
      if (dateA === dateB) return String(b.check_in || '').localeCompare(String(a.check_in || ''));
      return dateB.localeCompare(dateA);
    });

    // Flag incomplete days (check_in without check_out, excluding izin/cuti/libur_tahunan)
    const incomplete = allRecords.filter(r => r.check_in && !r.check_out && (!r.type || r.type === 'check_in'));
    const totalDeduction = incomplete.length * 40000;

    return res.json({
      records: allRecords,
      incomplete_days: incomplete.map(r => ({ id: r.id, employee_name: r.employee_name, date: r.date })),
      total_deduction: totalDeduction,
      total_deduction_formatted: `Rp ${totalDeduction.toLocaleString('id-ID')}`
    });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal mengambil rekap absensi: ' + err.message });
  }
};

exports.updateAttendance = async (req, res) => {
  const { id } = req.params;
  const { check_in, check_out, status, distance } = req.body;
  try {
    let duration = null;
    if (check_in && check_out) {
      const diffMs = new Date(check_out) - new Date(check_in);
      if (!isNaN(diffMs) && diffMs >= 0) {
        const diffHrs = Math.floor(diffMs / 3600000);
        const diffMins = Math.floor((diffMs % 3600000) / 60000);
        const diffSecs = Math.floor((diffMs % 60000) / 1000);
        duration = [
          diffHrs.toString().padStart(2, '0'),
          diffMins.toString().padStart(2, '0'),
          diffSecs.toString().padStart(2, '0')
        ].join(':');
      }
    }

    await db.query(
      'UPDATE attendance SET check_in = ?, check_out = ?, status = ?, distance = ?, duration = ? WHERE id = ?',
      [check_in || null, check_out || null, status || 'di_kantor', distance || null, duration, id]
    );
    return res.json({ success: true, message: 'Data presensi berhasil diperbarui.' });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal memperbarui data presensi: ' + err.message });
  }
};

exports.setType = async (req, res) => {
  const { user_id, date, type } = req.body;
  const validTypes = ['check_in', 'izin', 'cuti', 'libur_tahunan'];
  if (!user_id || !date || !validTypes.includes(type)) {
    return res.status(400).json({ error: 'Parameter tidak valid. Diperlukan user_id, date, dan type.' });
  }
  try {
    const [existing] = await db.query(
      'SELECT id FROM attendance WHERE user_id = ? AND date = ? LIMIT 1',
      [user_id, date]
    );
    if (existing.length > 0) {
      if (type === 'check_in') {
        await db.query('UPDATE attendance SET type = ? WHERE id = ?', [type, existing[0].id]);
      } else {
        await db.query('UPDATE attendance SET type = ?, check_in = NULL, check_out = NULL, duration = NULL WHERE id = ?', [type, existing[0].id]);
      }
    } else {
      await db.query(
        'INSERT INTO attendance (user_id, date, type) VALUES (?, ?, ?)',
        [user_id, date, type]
      );
    }
    return res.json({ success: true, message: `Tipe absensi berhasil diatur ke ${type}.` });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal mengatur tipe absensi: ' + err.message });
  }
};

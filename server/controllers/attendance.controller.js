const db = require('../config/db');

function getJakartaDate() {
  const tzOffset = 7 * 60; // Jakarta is UTC+7
  const d = new Date();
  const localTime = d.getTime() + (d.getTimezoneOffset() + tzOffset) * 60000;
  const localDate = new Date(localTime);
  return localDate.toISOString().split('T')[0];
}

// === IP WHITELIST (Anti-Cheat via WiFi) ===
// Semua device yang pakai WiFi kantor punya IP publik yang SAMA
function getClientIp(req) {
  // Cloudflare: CF-Connecting-IP langsung kasih IP asli client
  // Behind proxy: X-Forwarded-For (ambil IP pertama, bukan proxy IP)
  // Direct: req.socket.remoteAddress
  return req.headers['cf-connecting-ip']
    || (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
    || req.socket.remoteAddress
    || '';
}

// === CIDR MATCHING ===
// Check if a single IP falls within a CIDR range (e.g. 157.85.210.0/23)
function ipToLong(ip) {
  const parts = ip.split('.').map(Number);
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function isIpInCidr(ip, cidr) {
  const [range, bits] = cidr.split('/');
  if (!bits) return ip === range; // no prefix = exact match
  const prefix = parseInt(bits, 10);
  const mask = (~0 << (32 - prefix)) >>> 0;
  return (ipToLong(ip) & mask) === (ipToLong(range) & mask);
}

function checkOfficeIp(req) {
  const entries = (process.env.OFFICE_IP || '').split(',').map(e => e.trim()).filter(Boolean);
  if (entries.length === 0) return { allowed: true, message: 'No IP restriction configured' };

  const clientIp = getClientIp(req);
  const allowed = entries.some(entry => isIpInCidr(clientIp, entry));
  return { allowed, clientIp, officeIps: entries };
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
  const isAdminRole = ['admin', 'super_admin'].includes(req.user.role);
  const today = getJakartaDate();
  const ip = getClientIp(req);

  // IP whitelist check (skip for admin via dashboard API)
  if (!isAdminRole || !req.headers['x-dashboard-key']) {
    const ipCheck = checkOfficeIp(req);
    // DEBUG: log actual IP received
    console.log(`[checkIn] user=${req.user?.id} clientIp=${ipCheck.clientIp} allowed=${ipCheck.allowed}`);
    if (!ipCheck.allowed) {
      return res.status(403).json({ 
        error: 'Hanya bisa absen dari WiFi kantor.', 
        clientIp: ipCheck.clientIp,
        detail: `IP Anda (${ipCheck.clientIp}) tidak terdaftar sebagai WiFi kantor.`
      });
    }
  }

  try {
    // Check duplication
    const [check] = await db.query('SELECT id FROM attendance WHERE user_id = ? AND date = ?', [req.user.id, today]);
    if (check.length > 0) {
      return res.status(400).json({ error: 'Anda sudah check-in hari ini.' });
    }

    const status = 'di_kantor';

    await db.query(
      'INSERT INTO attendance (user_id, check_in, status, ip_address, date) VALUES (?, NOW(), ?, ?, ?)',
      [req.user.id, status, ip, today]
    );

    return res.json({
      success: true,
      message: 'Check-in berhasil disimpan!',
      status,
      ip
    });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal menyimpan check-in: ' + err.message });
  }
};

exports.checkOut = async (req, res) => {
    const isAdminRole = ['admin', 'super_admin'].includes(req.user.role);
    const today = getJakartaDate();
    const ip = getClientIp(req);

    // IP whitelist check (skip for admin via dashboard API)
    if (!isAdminRole || !req.headers['x-dashboard-key']) {
      const ipCheck = checkOfficeIp(req);
      if (!ipCheck.allowed) {
        return res.status(403).json({ 
          error: 'Hanya bisa check-out dari WiFi kantor.', 
          clientIp: ipCheck.clientIp,
          detail: `IP Anda (${ipCheck.clientIp}) tidak terdaftar sebagai WiFi kantor.`
        });
      }
    }

    try {
      // Find checking today without check_out
      const [check] = await db.query(
        'SELECT id, check_in FROM attendance WHERE user_id = ? AND date = ? AND check_out IS NULL ORDER BY id DESC LIMIT 1',
        [req.user.id, today]
      );

      if (check.length === 0) {
        return res.status(400).json({ error: 'Anda belum check-in hari ini, atau sudah melakukan check-out.' });
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
        'UPDATE attendance SET check_out = NOW(), duration = ?, ip_address = ? WHERE id = ?',
        [duration, ip, check[0].id]
      );

      return res.json({
        success: true,
        message: 'Check-out berhasil disimpan!',
        duration,
        status: 'di_kantor',
        ip
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

// === GPS TRACKING (Anti-Cheat Real-Time) ===

// Hitung jarak Haversine (server-side, gak bisa diakalin)
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// POST /api/attendance/track-gps — frontend kirim GPS tiap 60 detik setelah check-in
exports.trackGps = async (req, res) => {
  try {
    const { latitude, longitude, accuracy } = req.body;
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'GPS coordinates required.' });
    }

    // Cari attendance aktif hari ini (belum check-out)
    const [rows] = await db.query(
      'SELECT id, check_in, latitude AS checkin_lat, longitude AS checkin_lng FROM attendance WHERE user_id = ? AND date = CURDATE() AND check_out IS NULL ORDER BY id DESC LIMIT 1',
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.json({ success: true, message: 'No active attendance to track.' });
    }

    const attendance = rows[0];
    const userLat = parseFloat(latitude);
    const userLng = parseFloat(longitude);
    const acc = parseFloat(accuracy) || 0;

    // Ambil office settings
    const [settingsRows] = await db.query('SELECT setting_key, setting_value FROM office_settings');
    const settings = {};
    settingsRows.forEach(r => settings[r.setting_key] = r.setting_value);
    const officeLat = parseFloat(settings.office_latitude || '-7.7326');
    const officeLng = parseFloat(settings.office_longitude || '110.3988');
    const officeRadius = parseFloat(settings.office_radius || '20');

    // Server-side distance calculation (bukan client-side)
    const distanceFromOffice = haversineDistance(userLat, userLng, officeLat, officeLng);

    // === ANOMALY DETECTION ===
    let isSuspicious = false;
    let suspiciousReasons = [];

    // 1. GPS accuracy terlalu tinggi (kemungkinan fake/mock location)
    if (acc > 0 && acc < 5) {
      isSuspicious = true;
      suspiciousReasons.push('accuracy_suspiciously_high');
    }

    // 2. Cek distance dari check-in location (jump terlalu jauh)
    if (attendance.checkin_lat && attendance.checkin_lng) {
      const distFromCheckin = haversineDistance(
        userLat, userLng,
        parseFloat(attendance.checkin_lat), parseFloat(attendance.checkin_lng)
      );
      // Kalau geser > 500m dari posisi check-in dalam satu tracking interval
      if (distFromCheckin > 500) {
        isSuspicious = true;
        suspiciousReasons.push(`jump_${Math.round(distFromCheckin)}m_from_checkin`);
      }
    }

    // 3. Cek GPS log sebelumnya untuk speed anomaly
    const [prevLogs] = await db.query(
      'SELECT latitude, longitude, created_at FROM attendance_gps_logs WHERE attendance_id = ? ORDER BY id DESC LIMIT 1',
      [attendance.id]
    );
    if (prevLogs.length > 0) {
      const prev = prevLogs[0];
      const prevLat = parseFloat(prev.latitude);
      const prevLng = parseFloat(prev.longitude);
      const prevTime = new Date(prev.created_at).getTime();
      const now = Date.now();
      const timeDiffSeconds = (now - prevTime) / 1000;

      if (timeDiffSeconds > 0) {
        const distMoved = haversineDistance(userLat, userLng, prevLat, prevLng);
        const speedMps = distMoved / timeDiffSeconds; // meters per second
        const speedKmh = speedMps * 3.6;

        // Kalau speed > 200 km/h (kemungkinan GPS spoof / coordinate jump)
        if (speedKmh > 200) {
          isSuspicious = true;
          suspiciousReasons.push(`impossible_speed_${Math.round(speedKmh)}kmh`);
        }
      }
    }

    // 4. Koordinat nol atau default (belum dapat GPS)
    if (userLat === 0 && userLng === 0) {
      isSuspicious = true;
      suspiciousReasons.push('zero_coordinates');
    }

    // Simpan GPS log
    const reason = suspiciousReasons.length > 0 ? suspiciousReasons.join(', ') : null;
    await db.query(
      'INSERT INTO attendance_gps_logs (attendance_id, user_id, latitude, longitude, accuracy, distance_from_office, is_suspicious, suspicious_reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [attendance.id, req.user.id, userLat, userLng, acc, distanceFromOffice, isSuspicious ? 1 : 0, reason]
    );

    return res.json({
      success: true,
      distance: Math.round(distanceFromOffice),
      status: distanceFromOffice <= officeRadius ? 'di_kantor' : 'luar_kantor',
      is_suspicious: isSuspicious,
      suspicious_reasons: suspiciousReasons
    });
  } catch (err) {
    return res.status(500).json({ error: 'GPS tracking error: ' + err.message });
  }
};

// GET /api/attendance/gps-logs/:attendanceId — admin cek GPS trail
exports.getGpsLogs = async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const [logs] = await db.query(
      'SELECT * FROM attendance_gps_logs WHERE attendance_id = ? ORDER BY created_at ASC',
      [attendanceId]
    );
    return res.json(logs);
  } catch (err) {
    return res.status(500).json({ error: 'Gagal mengambil GPS logs: ' + err.message });
  }
};

// === WIFI STATUS CHECK (Client-Side Indicator) ===
exports.checkWifi = async (req, res) => {
  // Disable Cloudflare/CDN caching — IP check must be real-time
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  const ipCheck = checkOfficeIp(req);
  // DEBUG: log actual IP received
  console.log(`[checkWifi] user=${req.user?.id} clientIp=${ipCheck.clientIp} allowed=${ipCheck.allowed} officeIps=${JSON.stringify(ipCheck.officeIps)}`);
  return res.json({
    connected: ipCheck.allowed,
    clientIp: ipCheck.clientIp || null,
    officeIps: ipCheck.officeIps || []
  });
};

// server/controllers/leave.controller.js
const db = require('../config/db');

// Submit leave request (for employees)
exports.createLeave = async (req, res) => {
  const { start_date, end_date, reason } = req.body;
  const user_id = req.user.id;

  if (!start_date || !end_date || !reason) {
    return res.status(400).json({ error: 'Tanggal mulai, tanggal selesai, dan alasan wajib diisi.' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO leaves (user_id, start_date, end_date, reason, status) VALUES (?, ?, ?, ?, ?)',
      [user_id, start_date, end_date, reason, 'pending']
    );

    return res.json({
      success: true,
      message: 'Pengajuan cuti berhasil dikirim.',
      id: result.insertId
    });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal mengajukan cuti: ' + err.message });
  }
};

// List all leave requests (for superadmin / admin)
exports.getAllLeaves = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT l.id, l.user_id, l.start_date, l.end_date, l.reason, l.status, l.created_at, 
              u.name AS employee_name, u.role AS employee_role, u.department AS employee_department 
       FROM leaves l 
       JOIN users u ON l.user_id = u.id 
       ORDER BY l.id DESC`
    );
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: 'Gagal mengambil data pengajuan cuti: ' + err.message });
  }
};

// List leaves for the logged-in user
exports.getUserLeaves = async (req, res) => {
  const user_id = req.user.id;
  try {
    const [rows] = await db.query(
      'SELECT id, start_date, end_date, reason, status, created_at FROM leaves WHERE user_id = ? ORDER BY id DESC',
      [user_id]
    );
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: 'Gagal mengambil riwayat cuti Anda: ' + err.message });
  }
};

// Update leave request status (Superadmin only)
exports.updateLeaveStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved' or 'rejected'

  if (!status || !['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Status tidak valid. Gunakan approved atau rejected.' });
  }

  try {
    const [result] = await db.query(
      'UPDATE leaves SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Pengajuan cuti tidak ditemukan.' });
    }

    return res.json({
      success: true,
      message: `Status pengajuan cuti berhasil diubah menjadi ${status}.`
    });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal memperbarui status pengajuan cuti: ' + err.message });
  }
};

// Calculate total approved leave days for a specific user in a specific month (YYYY-MM)
exports.getMonthApprovedLeaveDays = async (req, res) => {
  const { user_id, month } = req.params; // month is YYYY-MM

  if (!user_id || !month || !/^\d{4}-\d{2}$/.test(month)) {
    return res.status(400).json({ error: 'Format parameter tidak valid.' });
  }

  try {
    // Parse target month limits
    const [yearPart, monthPart] = month.split('-').map(Number);
    const targetStart = new Date(yearPart, monthPart - 1, 1);
    const targetEnd = new Date(yearPart, monthPart, 0); // Last day of target month

    // Fetch approved leaves overlapping with target month for this user
    const [leaves] = await db.query(
      `SELECT start_date, end_date FROM leaves 
       WHERE user_id = ? AND status = 'approved' 
         AND start_date <= ? AND end_date >= ?`,
      [user_id, targetEnd.toISOString().split('T')[0], targetStart.toISOString().split('T')[0]]
    );

    let totalDays = 0;

    // Loop through each leave and count days within target month
    for (const leave of leaves) {
      const leaveStart = new Date(leave.start_date);
      const leaveEnd = new Date(leave.end_date);

      // Bound start and end to the target month limits
      const boundStart = new Date(Math.max(leaveStart, targetStart));
      const boundEnd = new Date(Math.min(leaveEnd, targetEnd));

      // Calculate difference in days (inclusive)
      const diffTime = boundEnd - boundStart;
      if (diffTime >= 0) {
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        totalDays += diffDays;
      }
    }

    return res.json({
      user_id: Number(user_id),
      month,
      totalDays
    });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal menghitung hari cuti: ' + err.message });
  }
};

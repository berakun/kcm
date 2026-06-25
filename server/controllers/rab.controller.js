// server/controllers/rab.controller.js
const db = require('../config/db');

// ==========================================
// 1. RAB BUILDER
// ==========================================
exports.getRabs = async (req, res) => {
  const id = req.query.id;
  try {
    if (id) {
      const [rabs] = await db.query(
        'SELECT r.*, u.name as creator_name FROM rab r LEFT JOIN users u ON r.created_by = u.id WHERE r.id = ?',
        [id]
      );
      if (rabs.length === 0) {
        return res.status(404).json({ error: 'RAB tidak ditemukan.' });
      }
      const [items] = await db.query('SELECT * FROM rab_items WHERE rab_id = ? ORDER BY id ASC', [id]);
      const rab = rabs[0];
      rab.items = items;
      return res.json(rab);
    } else {
      const [rabs] = await db.query(
        'SELECT r.*, u.name as creator_name FROM rab r LEFT JOIN users u ON r.created_by = u.id ORDER BY r.id DESC'
      );
      return res.json(rabs);
    }
  } catch (err) {
    return res.status(500).json({ error: 'Gagal mengambil data RAB: ' + err.message });
  }
};

exports.saveRab = async (req, res) => {
  const { id, code, project_name, client, date, status, items } = req.body;

  if (!code || !project_name) {
    return res.status(400).json({ error: 'Kode RAB dan nama proyek wajib diisi.' });
  }

  // Calculate total budget
  let totalBudget = 0;
  if (items && Array.isArray(items)) {
    items.forEach(item => {
      const qty = parseFloat(item.qty) || 0;
      const price = parseFloat(item.unit_price) || 0;
      totalBudget += (qty * price);
    });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    let rabId = id;

    if (id) {
      // Update RAB
      await connection.query(
        'UPDATE rab SET code = ?, project_name = ?, client = ?, date = ?, status = ?, total_budget = ? WHERE id = ?',
        [code, project_name, client || null, date || new Date(), status || 'draft', totalBudget, id]
      );
      
      // Delete old items
      await connection.query('DELETE FROM rab_items WHERE rab_id = ?', [id]);
    } else {
      // Insert RAB
      const [result] = await connection.query(
        'INSERT INTO rab (code, project_name, client, date, status, total_budget, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [code, project_name, client || null, date || new Date(), status || 'draft', totalBudget, req.user.id]
      );
      rabId = result.insertId;
    }

    // Insert items
    if (items && Array.isArray(items)) {
      const insertQuery = 'INSERT INTO rab_items (rab_id, section, item_name, description, unit, qty, unit_price) VALUES (?, ?, ?, ?, ?, ?, ?)';
      for (const item of items) {
        if (!item.item_name) continue;
        await connection.query(insertQuery, [
          rabId,
          item.section || 'bahan',
          item.item_name,
          item.description || null,
          item.unit || 'pcs',
          parseFloat(item.qty) || 1,
          parseFloat(item.unit_price) || 0
        ]);
      }
    }

    await connection.commit();
    return res.json({
      success: true,
      message: 'RAB berhasil disimpan.',
      id: rabId
    });
  } catch (err) {
    await connection.rollback();
    return res.status(500).json({ error: 'Gagal menyimpan RAB: ' + err.message });
  } finally {
    connection.release();
  }
};

exports.deleteRab = async (req, res) => {
  const id = req.query.id || req.body.id;
  if (!id) {
    return res.status(400).json({ error: 'ID RAB wajib diisi.' });
  }

  try {
    await db.query('DELETE FROM rab WHERE id = ?', [id]);
    return res.json({ success: true, message: 'RAB berhasil dihapus.' });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal menghapus RAB: ' + err.message });
  }
};

// ==========================================
// 2. REMBES (LEAKAGE)
// ==========================================
exports.getRembes = async (req, res) => {
  const rabId = req.query.rab_id;
  try {
    if (rabId) {
      const [rows] = await db.query(
        'SELECT * FROM rembes WHERE rab_id = ? ORDER BY date DESC',
        [rabId]
      );
      return res.json(rows);
    } else {
      const [rows] = await db.query(
        'SELECT rem.*, rab.project_name FROM rembes rem JOIN rab ON rem.rab_id = rab.id ORDER BY rem.date DESC'
      );
      return res.json(rows);
    }
  } catch (err) {
    return res.status(500).json({ error: 'Gagal mengambil rembes: ' + err.message });
  }
};

exports.saveRembes = async (req, res) => {
  const { id, rab_id, date, description, rab_amount, actual_amount, notes } = req.body;

  if (!rab_id || !description) {
    return res.status(400).json({ error: 'Proyek RAB dan deskripsi belanja wajib diisi.' });
  }

  const rAmt = parseFloat(rab_amount) || 0;
  const aAmt = parseFloat(actual_amount) || 0;
  
  let status = 'aman';
  if (aAmt > rAmt) {
    status = 'melebihi';
  } else if (aAmt > (rAmt * 0.9)) {
    status = 'waspada';
  }

  try {
    if (id) {
      await db.query(
        'UPDATE rembes SET rab_id = ?, date = ?, description = ?, rab_amount = ?, actual_amount = ?, notes = ?, status = ? WHERE id = ?',
        [rab_id, date || new Date(), description, rAmt, aAmt, notes || null, status, id]
      );
    } else {
      await db.query(
        'INSERT INTO rembes (rab_id, date, description, rab_amount, actual_amount, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [rab_id, date || new Date(), description, rAmt, aAmt, notes || null, status]
      );
    }
    return res.json({ success: true, message: 'Rembes berhasil disimpan.' });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal menyimpan rembesan: ' + err.message });
  }
};

exports.deleteRembes = async (req, res) => {
  const id = req.query.id || req.body.id;
  if (!id) {
    return res.status(400).json({ error: 'ID Rembes wajib diisi.' });
  }
  try {
    await db.query('DELETE FROM rembes WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Rembes berhasil dihapus.' });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal menghapus rembesan: ' + err.message });
  }
};

// ==========================================
// 3. CASHBON
// ==========================================
exports.getCashbons = async (req, res) => {
  try {
    let query = 'SELECT c.*, u.name as employee_name, ap.name as approver_name FROM cashbon c JOIN users u ON c.user_id = u.id LEFT JOIN users ap ON c.approved_by = ap.id';
    const params = [];
    
    // Non-admins see only their own cashbon
    if (!['admin', 'super_admin'].includes(req.user.role)) {
      query += ' WHERE c.user_id = ?';
      params.push(req.user.id);
    }
    
    query += ' ORDER BY c.date DESC';
    const [rows] = await db.query(query, params);
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: 'Gagal mengambil cashbon: ' + err.message });
  }
};

exports.createCashbon = async (req, res) => {
  const { date, recipient, description, amount, notes } = req.body;

  if (!recipient || !amount || parseFloat(amount) <= 0) {
    return res.status(400).json({ error: 'Penerima dan jumlah nominal cashbon wajib diisi.' });
  }

  try {
    let proof_file = null;
    if (req.file) {
      proof_file = 'assets/images/proofs/' + req.file.filename;
    }

    await db.query(
      'INSERT INTO cashbon (user_id, date, recipient, description, amount, status, proof_file, notes) VALUES (?, ?, ?, ?, ?, "pending", ?, ?)',
      [req.user.id, date || new Date(), recipient, description || null, parseFloat(amount), proof_file, notes || null]
    );

    return res.json({ success: true, message: 'Pengajuan Cashbon berhasil diajukan.' });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal mengajukan cashbon: ' + err.message });
  }
};

exports.updateCashbonStatus = async (req, res) => {
  const { id, status, notes } = req.body;

  if (!id || !['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'ID cashbon dan status persetujuan tidak valid.' });
  }

  try {
    await db.query(
      'UPDATE cashbon SET status = ?, notes = ?, approved_by = ? WHERE id = ?',
      [status, notes || null, req.user.id, id]
    );
    return res.json({ success: true, message: 'Persetujuan cashbon berhasil disimpan.' });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal menyetujui cashbon: ' + err.message });
  }
};


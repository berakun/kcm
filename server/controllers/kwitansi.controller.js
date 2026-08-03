// server/controllers/kwitansi.controller.js
const db = require('../config/db');
const fs = require('fs');
const path = require('path');

exports.getKwitansi = async (req, res) => {
  try {
    const { rab_id } = req.query;
    let sql = `
      SELECT ki.*, r.code AS rab_code, r.project_name, u.name AS uploader_name
      FROM kwitansi_invoices ki
      LEFT JOIN rab r ON ki.rab_id = r.id
      LEFT JOIN users u ON ki.uploaded_by = u.id
    `;
    const params = [];
    if (rab_id) {
      sql += ' WHERE ki.rab_id = ?';
      params.push(rab_id);
    }
    sql += ' ORDER BY ki.date DESC, ki.id DESC';
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('getKwitansi error:', err);
    res.status(500).json({ error: 'Gagal memuat data kwitansi/invoice.' });
  }
};

exports.uploadKwitansi = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'File wajib diupload.' });
    const { rab_id, type, date, description } = req.body;
    if (!rab_id) return res.status(400).json({ error: 'Project wajib dipilih.' });

    const ext = path.extname(req.file.originalname).toLowerCase();
    let fileType = 'other';
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) fileType = 'image';
    else if (ext === '.pdf') fileType = 'pdf';
    else if (['.xls', '.xlsx', '.csv'].includes(ext)) fileType = 'excel';

    const filePath = `/assets/images/kwitansi/${req.file.filename}`;

    const [result] = await db.query(
      'INSERT INTO kwitansi_invoices (rab_id, type, file_path, file_type, original_name, date, description, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [rab_id, type || 'kwitansi', filePath, fileType, req.file.originalname, date || null, description || null, req.user?.id || null]
    );

    res.json({ id: result.insertId, message: 'Berhasil diupload.' });
  } catch (err) {
    console.error('uploadKwitansi error:', err);
    res.status(500).json({ error: 'Gagal upload file.' });
  }
};

exports.deleteKwitansi = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT file_path FROM kwitansi_invoices WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Data tidak ditemukan.' });

    // Delete file from disk
    const filePath = path.join(__dirname, '../../client/public', rows[0].file_path);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await db.query('DELETE FROM kwitansi_invoices WHERE id = ?', [id]);
    res.json({ message: 'Berhasil dihapus.' });
  } catch (err) {
    console.error('deleteKwitansi error:', err);
    res.status(500).json({ error: 'Gagal menghapus data.' });
  }
};

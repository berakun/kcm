// server/controllers/user.controller.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

exports.getUsers = async (req, res) => {
  const id = req.query.id;
  try {
    if (id) {
      const [rows] = await db.query('SELECT id, name, username, phone, role, department, status, avatar, last_active, created_at FROM users WHERE id = ?', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'User tidak ditemukan.' });
      }
      return res.json(rows[0]);
    } else {
      const [rows] = await db.query('SELECT id, name, username, phone, role, department, status, avatar, last_active, created_at FROM users ORDER BY id DESC');
      return res.json(rows);
    }
  } catch (err) {
    return res.status(500).json({ error: 'Gagal mengambil data user: ' + err.message });
  }
};

exports.createUser = async (req, res) => {
  const { name, username, password, phone, role, department, status } = req.body;

  if (!name || !username || !password) {
    return res.status(400).json({ error: 'Nama, username, dan password wajib diisi.' });
  }

  try {
    // Check if username conflict
    const [check] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
    if (check.length > 0) {
      return res.status(400).json({ error: 'Username sudah digunakan.' });
    }

    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await db.query(
      'INSERT INTO users (name, username, password, phone, role, department, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, username, hashedPassword, phone || null, role || 'staff', department || null, status || 'active']
    );

    return res.json({
      success: true,
      message: 'User berhasil ditambahkan.',
      id: result.insertId
    });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal menambahkan user: ' + err.message });
  }
};

exports.updateUser = async (req, res) => {
  const { id, name, username, password, phone, role, department, status } = req.body;

  if (!id || !name || !username) {
    return res.status(400).json({ error: 'ID, nama, dan username wajib diisi.' });
  }

  try {
    // Check username conflict
    const [check] = await db.query('SELECT id FROM users WHERE username = ? AND id != ?', [username, id]);
    if (check.length > 0) {
      return res.status(400).json({ error: 'Username sudah digunakan oleh user lain.' });
    }

    if (password) {
      const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await db.query(
        'UPDATE users SET name = ?, username = ?, password = ?, phone = ?, role = ?, department = ?, status = ? WHERE id = ?',
        [name, username, hashedPassword, phone || null, role, department || null, status, id]
      );
    } else {
      await db.query(
        'UPDATE users SET name = ?, username = ?, phone = ?, role = ?, department = ?, status = ? WHERE id = ?',
        [name, username, phone || null, role, department || null, status, id]
      );
    }

    return res.json({
      success: true,
      message: 'User berhasil diperbarui.'
    });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal memperbarui user: ' + err.message });
  }
};

exports.deleteUser = async (req, res) => {
  const id = req.query.id || req.body.id;
  
  if (!id) {
    return res.status(400).json({ error: 'ID User wajib diisi.' });
  }

  if (id == req.user.id) {
    return res.status(400).json({ error: 'Anda tidak dapat menghapus akun Anda sendiri.' });
  }

  try {
    await db.query('DELETE FROM users WHERE id = ?', [id]);
    return res.json({
      success: true,
      message: 'User berhasil dihapus.'
    });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal menghapus user: ' + err.message });
  }
};

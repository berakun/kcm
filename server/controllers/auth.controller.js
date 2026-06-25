// server/controllers/auth.controller.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan password wajib diisi.' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ? LIMIT 1', [username]);
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Username atau password salah.' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Akun Anda dinonaktifkan. Silakan hubungi Super Admin.' });
    }

    // Sign JWT
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
        department: user.department
      },
      process.env.JWT_SECRET || 'kcm_super_secret_key_2024_change_this_in_production',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Update last active
    await db.query('UPDATE users SET last_active = NOW() WHERE id = ?', [user.id]);

    return res.json({
      success: true,
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
        department: user.department,
        avatar: user.avatar
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Terjadi kesalahan internal server: ' + err.message });
  }
};


exports.me = async (req, res) => {
  // req.user is populated by auth middleware
  return res.json({
    authenticated: true,
    user: req.user
  });
};

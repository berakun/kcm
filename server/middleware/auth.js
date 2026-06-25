// server/middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Akses ditolak. Token tidak disediakan.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Akses ditolak. Format token tidak valid.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'kcm_super_secret_key_2024_change_this_in_production');
    req.user = verified;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token kedaluwarsa atau tidak valid.' });
  }
};

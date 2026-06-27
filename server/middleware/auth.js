// server/middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  // Read token from cookies (for web app) or Authorization header (for scripts/curl/Postman)
  const token = req.cookies?.kcm_token || (req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : null);

  if (!token) {
    return res.status(401).json({ error: 'Akses ditolak. Token tidak disediakan.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'kcm_super_secret_key_2024_change_this_in_production');
    req.user = verified;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token kedaluwarsa atau tidak valid.' });
  }
};

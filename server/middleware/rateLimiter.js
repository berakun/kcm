// server/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Terlalu banyak permintaan dari IP ini. Silakan coba lagi nanti.' },
  standardHeaders: true,
  legacyHeaders: false
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login attempts per windowMs
  message: { error: 'Terlalu banyak percobaan login dari IP ini. Silakan coba lagi dalam 15 menit.' },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { generalLimiter, loginLimiter };

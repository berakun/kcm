// server/config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'kcm_database',
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  timezone: '+07:00',
  charset: 'utf8mb4'
});

// Ensure every connection uses WIB timezone
pool.on('connection', (connection) => {
  connection.query("SET time_zone = '+07:00'");
});

module.exports = pool;

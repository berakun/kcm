// server/server.js
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middlewares
const configureSecurity = require('./middleware/security');
configureSecurity(app);

// Request Logging
app.use(morgan('dev'));

// Cookie Parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded assets statically in development (double-proofing)
app.use('/assets', express.static(path.join(__dirname, '../client/public/assets')));

// Apply rate limiting middleware
const { generalLimiter } = require('./middleware/rateLimiter');
app.use('/api', generalLimiter);

// Load index routes
const apiRoutes = require('./routes');
app.use('/api', apiRoutes);

// Serve frontend build (production)
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// SPA fallback — all non-API routes serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Express error log:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Terjadi kesalahan sistem internal server.'
  });
});

// Boot Server
app.listen(PORT, async () => {
  console.log(`[KCM Server] Backend running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  
  // Create ongkos_tukang table if not exists
  const db = require('./config/db');
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS ongkos_tukang (
        id INT PRIMARY KEY AUTO_INCREMENT,
        rab_id INT NOT NULL,
        date DATE NOT NULL,
        description VARCHAR(255) NOT NULL,
        amount DECIMAL(15,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (rab_id) REFERENCES rab(id) ON DELETE CASCADE
      )
    `);
    console.log('[KCM Server] Table ongkos_tukang verified/created.');
  } catch (err) {
    console.error('[KCM Server] Failed to verify/create table ongkos_tukang:', err.message);
  }

  // Create purchase_orders table if not exists
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS purchase_orders (
        id INT PRIMARY KEY AUTO_INCREMENT,
        po_number VARCHAR(50) UNIQUE NOT NULL,
        to_supplier VARCHAR(200),
        date DATE,
        phone VARCHAR(20),
        attn VARCHAR(100),
        rab_id INT,
        items JSON,
        projects TEXT,
        material_ref TEXT,
        total DECIMAL(15,2) DEFAULT 0,
        ppn DECIMAL(15,2) DEFAULT 0,
        grand_total DECIMAL(15,2) DEFAULT 0,
        in_words TEXT,
        note TEXT,
        deliver_by DATE,
        deliver_to VARCHAR(200),
        ordered_by VARCHAR(100),
        purchasing VARCHAR(100),
        prepared_by VARCHAR(100),
        approved_by VARCHAR(100) DEFAULT 'Anriko K, ST.',
        term_of_payment VARCHAR(200) DEFAULT 'Anriko K, ST.',
        status VARCHAR(20) DEFAULT 'draft',
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (rab_id) REFERENCES rab(id) ON DELETE SET NULL,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    console.log('[KCM Server] Table purchase_orders verified/created.');
  } catch (err) {
    console.error('[KCM Server] Failed to verify/create table purchase_orders:', err.message);
  }

  // Ensure attendance table has type column
  try {
    const [cols] = await db.query("SHOW COLUMNS FROM attendance LIKE 'type'");
    if (cols.length === 0) {
      await db.query("ALTER TABLE attendance ADD COLUMN type VARCHAR(20) DEFAULT 'check_in'");
      console.log("[KCM Server] Added 'type' column to 'attendance' table.");
    }
  } catch (err) {
    console.error("[KCM Server] Failed to verify/add 'type' column in 'attendance':", err.message);
  }

  // Run database seeder
  const seedDb = require('./database/seed');
  await seedDb();
});

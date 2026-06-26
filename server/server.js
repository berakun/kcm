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
  
  // Run database seeder
  const seedDb = require('./database/seed');
  await seedDb();
});

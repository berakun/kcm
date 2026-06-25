// server/middleware/security.js
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

module.exports = (app) => {
  app.use(helmet({
    crossOriginResourcePolicy: false // Allows accessing uploaded portfolio images
  }));
  
  app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));
};

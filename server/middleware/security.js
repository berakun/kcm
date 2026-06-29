// server/middleware/security.js
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const allowedOrigins = [
  process.env.CORS_ORIGIN || 'https://kcm.berakun.web.id',
  'https://kcm.berakun.web.id',
  'http://localhost:5173',
  'http://localhost:3000'
];

module.exports = (app) => {
  app.use(helmet({
    crossOriginResourcePolicy: false, // Allows accessing uploaded portfolio images
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        fontSrc: ["'self'", "https:", "data:"],
        formAction: ["'self'"],
        frameAncestors: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        objectSrc: ["'none'"],
        scriptSrc: ["'self'", "https://www.google.com", "https://maps.googleapis.com", "https://maps.gstatic.com"],
        scriptSrcAttr: ["'none'"],
        styleSrc: ["'self'", "https:", "'unsafe-inline'"],
        frameSrc: ["'self'", "https://www.google.com", "https://maps.google.com"],
        upgradeInsecureRequests: []
      }
    }
  }));
  
  app.use(cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Allow mobile/curl/Postman
      if (allowedOrigins.includes(origin) || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400 // Preflight cache 24 hours
  }));

  // Set Permissions-Policy header (geolocation allowed for self origin, other sensors disabled)
  app.use((req, res, next) => {
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=self, interest-cohort=(), usb=(), magnetometer=(), gyroscope=()');
    next();
  });
};

// server/routes/portfolio.routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const portfolioController = require('../controllers/portfolio.controller');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../client/public/assets/images/portfolio/');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'portfolio-' + uniqueSuffix + ext);
  }
});

// File validation filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Format berkas gambar tidak didukung. Gunakan JPG, PNG, atau WEBP.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// GET portfolio is public (or uses optional auth to view drafts)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    const jwt = require('jsonwebtoken');
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET || 'kcm_super_secret_key_2024_change_this_in_production');
    } catch (e) {}
  }
  next();
};

router.get('/', optionalAuth, portfolioController.getPortfolios);

// Super Admin only routes for modification
router.post('/', authMiddleware, roleMiddleware(['super_admin']), upload.array('images', 10), portfolioController.createPortfolio);
router.post('/update', authMiddleware, roleMiddleware(['super_admin']), upload.array('images', 10), portfolioController.updatePortfolio);
router.delete('/', authMiddleware, roleMiddleware(['super_admin']), portfolioController.deletePortfolio);

module.exports = router;

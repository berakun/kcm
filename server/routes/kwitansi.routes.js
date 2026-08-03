// server/routes/kwitansi.routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const kwitansiController = require('../controllers/kwitansi.controller');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../client/public/assets/images/kwitansi/');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|pdf|xlsx?|csv/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype) || file.mimetype?.includes('image') || file.mimetype?.includes('pdf') || file.mimetype?.includes('spreadsheet') || file.mimetype?.includes('excel');
    if (ext || mime) return cb(null, true);
    cb(new Error('Format file tidak didukung. Gunakan gambar, PDF, atau Excel.'));
  }
});

router.get('/', authMiddleware, roleMiddleware(['super_admin']), kwitansiController.getKwitansi);
router.post('/', authMiddleware, roleMiddleware(['super_admin']), upload.single('file'), kwitansiController.uploadKwitansi);
router.delete('/:id', authMiddleware, roleMiddleware(['super_admin']), kwitansiController.deleteKwitansi);

module.exports = router;

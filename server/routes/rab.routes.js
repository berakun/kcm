// server/routes/rab.routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const rabController = require('../controllers/rab.controller');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

// Multer Storage Configuration for Cashbon receipts
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../client/public/assets/images/proofs/');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'cashbon-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// RAB Builder routes (Admin/Super Admin only)
router.get('/', authMiddleware, rabController.getRabs);
router.post('/', authMiddleware, roleMiddleware(['admin', 'super_admin']), rabController.saveRab);
router.delete('/', authMiddleware, roleMiddleware(['admin', 'super_admin']), rabController.deleteRab);

// Rembes routes (Admin/Super Admin only)
router.get('/rembes', authMiddleware, rabController.getRembes);
router.post('/rembes', authMiddleware, roleMiddleware(['admin', 'super_admin']), rabController.saveRembes);
router.delete('/rembes', authMiddleware, roleMiddleware(['admin', 'super_admin']), rabController.deleteRembes);

// Cashbon routes
router.get('/cashbon', authMiddleware, rabController.getCashbons);
router.post('/cashbon', authMiddleware, upload.single('proof_file'), rabController.createCashbon);
router.put('/cashbon/status', authMiddleware, roleMiddleware(['admin', 'super_admin']), rabController.updateCashbonStatus);
module.exports = router;

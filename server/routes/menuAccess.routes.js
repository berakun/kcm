// server/routes/menuAccess.routes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const menuAccessController = require('../controllers/menuAccess.controller');

router.get('/', authMiddleware, roleMiddleware(['super_admin']), menuAccessController.getMenuAccess);
router.put('/', authMiddleware, roleMiddleware(['super_admin']), menuAccessController.updateMenuAccess);
router.put('/bulk', authMiddleware, roleMiddleware(['super_admin']), menuAccessController.bulkUpdateMenuAccess);

module.exports = router;

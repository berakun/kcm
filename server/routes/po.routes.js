// server/routes/po.routes.js
const express = require('express');
const router = express.Router();
const poController = require('../controllers/po.controller');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

router.get('/', authMiddleware, roleMiddleware(['admin', 'super_admin']), poController.getPos);
router.get('/:id', authMiddleware, roleMiddleware(['admin', 'super_admin']), poController.getPos);
router.post('/', authMiddleware, roleMiddleware(['admin', 'super_admin']), poController.createPo);
router.put('/:id', authMiddleware, roleMiddleware(['admin', 'super_admin']), poController.updatePo);
router.delete('/:id', authMiddleware, roleMiddleware(['admin', 'super_admin']), poController.deletePo);

module.exports = router;

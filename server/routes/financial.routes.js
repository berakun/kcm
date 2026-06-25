// server/routes/financial.routes.js
const express = require('express');
const router = express.Router();
const financialController = require('../controllers/financial.controller');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

router.get('/', authMiddleware, roleMiddleware(['admin', 'super_admin']), financialController.getReport);

module.exports = router;

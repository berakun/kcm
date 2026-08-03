// server/routes/salary.routes.js — salary settings & employee overrides
const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salary.controller');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

// All routes require auth + super_admin only
router.use(authMiddleware);
router.use(roleMiddleware(['super_admin']));

// Salary settings (per role)
router.get('/settings', salaryController.getSettings);
router.post('/settings', salaryController.saveSettings);

// Employee overrides (per user)
router.get('/overrides', salaryController.getOverrides);
router.post('/overrides', salaryController.saveOverrides);
router.delete('/overrides/:userId', salaryController.deleteOverride);

module.exports = router;

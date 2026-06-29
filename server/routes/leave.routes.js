// server/routes/leave.routes.js
const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leave.controller');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

// All endpoints require authentication
router.use(authMiddleware);

// Submit leave request (for logged-in employees / admins)
router.post('/', leaveController.createLeave);

// List leaves for the logged-in user
router.get('/my', leaveController.getUserLeaves);

// List all leave requests (Superadmin & Admin only)
router.get('/', roleMiddleware(['super_admin', 'admin']), leaveController.getAllLeaves);

// Update leave request status (Superadmin only)
router.put('/:id/status', roleMiddleware(['super_admin']), leaveController.updateLeaveStatus);

// Get total approved leave days for user in month
router.get('/user-month/:user_id/:month', leaveController.getMonthApprovedLeaveDays);

module.exports = router;

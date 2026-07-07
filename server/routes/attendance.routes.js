// server/routes/attendance.routes.js
const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

router.get('/settings', authMiddleware, attendanceController.getSettings);
router.post('/settings', authMiddleware, roleMiddleware(['super_admin']), attendanceController.saveSettings);

// WiFi status check (pre-flight, sebelum user klik tombol)
router.get('/check-wifi', authMiddleware, attendanceController.checkWifi);

router.get('/status', authMiddleware, attendanceController.getStatus);
router.get('/history', authMiddleware, attendanceController.getHistory);
router.get('/admin-list', authMiddleware, roleMiddleware(['admin', 'super_admin']), attendanceController.getAdminList);
router.get('/rekap', authMiddleware, roleMiddleware(['admin', 'super_admin']), attendanceController.getRekap);
router.put('/:id', authMiddleware, roleMiddleware(['super_admin']), attendanceController.updateAttendance);
router.delete('/:id', authMiddleware, roleMiddleware(['super_admin']), attendanceController.deleteAttendance);
router.post('/set-type', authMiddleware, roleMiddleware(['admin', 'super_admin']), attendanceController.setType);

router.post('/check-in', authMiddleware, attendanceController.checkIn);
router.post('/check-out', authMiddleware, attendanceController.checkOut);

// GPS Tracking (Anti-Cheat)
router.post('/track-gps', authMiddleware, attendanceController.trackGps);
router.get('/gps-logs/:attendanceId', authMiddleware, roleMiddleware(['admin', 'super_admin']), attendanceController.getGpsLogs);

module.exports = router;

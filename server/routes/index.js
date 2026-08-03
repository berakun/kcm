// server/routes/index.js
const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const portfolioRoutes = require('./portfolio.routes');
const rabRoutes = require('./rab.routes');
const attendanceRoutes = require('./attendance.routes');
const financialRoutes = require('./financial.routes');
const poRoutes = require('./po.routes');
const leaveRoutes = require('./leave.routes');
const salaryRoutes = require('./salary.routes');
const kwitansiRoutes = require('./kwitansi.routes');
const menuAccessRoutes = require('./menuAccess.routes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/rab', rabRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/financial', financialRoutes);
router.use('/po', poRoutes);
router.use('/leaves', leaveRoutes);
router.use('/salary', salaryRoutes);
router.use('/kwitansi', kwitansiRoutes);
router.use('/menu-access', menuAccessRoutes);

module.exports = router;

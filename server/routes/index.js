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

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/rab', rabRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/financial', financialRoutes);
router.use('/po', poRoutes);

module.exports = router;

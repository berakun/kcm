// server/routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

router.get('/', authMiddleware, roleMiddleware(['super_admin', 'admin']), userController.getUsers);
router.post('/', authMiddleware, roleMiddleware(['super_admin']), userController.createUser);
router.put('/', authMiddleware, roleMiddleware(['super_admin']), userController.updateUser);
router.delete('/', authMiddleware, roleMiddleware(['super_admin']), userController.deleteUser);

module.exports = router;

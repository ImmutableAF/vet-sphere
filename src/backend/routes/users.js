const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middlewares/auth');

const {
  userDashboard,
  updateUserInfo,
} = require('../controllers/users');

router.get('/me', authMiddleware, userDashboard);

router.put('/me', authMiddleware, updateUserInfo);

module.exports = router;
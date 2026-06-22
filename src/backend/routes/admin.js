const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middlewares/auth');
const { adminAuthMiddleware } = require('../middlewares/admin');

const {
  adminDashboard,
  updateVerifyStatus,
} = require('../controllers/admin');

router.get('/vets/pending', authMiddleware, adminAuthMiddleware, adminDashboard);

router.put('/vets/:id/verify', authMiddleware, adminAuthMiddleware, updateVerifyStatus);

module.exports = router;
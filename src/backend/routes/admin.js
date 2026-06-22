const express = require('express');
const router = express.Router();

const { authMiddleware, adminAuthmiddleware } = require('../middlewares/auth');

const {
  adminDashboard,
  updateVerifyStatus,
} = require('../controllers/users');

router.get('/vets/pending', authMiddleware, adminAuthmiddleware, adminDashboard);

router.put('/vets/:id/verify', authMiddleware, adminAuthmiddleware, updateVerifyStatus);

module.exports = router;
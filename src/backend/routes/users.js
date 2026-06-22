const express = require('express');
const router = express.Router();

const {
  adminDashboard,
  updateAdminInfo,
} = require('../controllers/users');

router.get('/me', adminDashboard);

router.put('/me', updateAdminInfo);

module.exports = router;
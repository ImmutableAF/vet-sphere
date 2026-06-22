const express = require('express');
const router = express.Router();

const {
  adminDashboard,
  updateAdminInfo,
} = require('../controllers/users');

router.get('/vets/pending', adminDashboard);

router.put('/vets/:id/verify', updateAdminInfo);

module.exports = router;
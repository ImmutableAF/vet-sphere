const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middlewares/auth');

const {
  createAppointment,
  getAppointments,
  getAvailability,
  updateAppointmentStatus,
} = require('../controllers/appointments');

router.post('/', authMiddleware, createAppointment);

router.get('/availability', authMiddleware, getAvailability);

router.get('/', authMiddleware, getAppointments);

router.put('/:id/status', authMiddleware, updateAppointmentStatus);

module.exports = router;
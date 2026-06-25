const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middlewares/auth');

const {createAppointment, getAppointments, updateAppointmentStatus} = require('../controllers/appointments');

router.post('/', authMiddleware, createAppointment);

router.get('/', authMiddleware, getAppointments);

router.put('/:id/status', authMiddleware, updateAppointmentStatus);

module.exports = router;
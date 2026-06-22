const express = require('express');
const router = express.Router();

const {createAppointment, getAppointments, updateAppointmentStatus} = require('../controllers/appointments');

router.post('/', createAppointment);

router.get('/', getAppointments);

router.put('/:id/status', updateAppointmentStatus);

module.exports = router;
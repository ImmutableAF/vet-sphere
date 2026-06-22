const Appointment = require('../models/appointments');

const createAppointment = async (req, res) => {
  try {
    const { 
      pet,
      vet,
      owner,
      date,
      reason
     } = req.body;

     const newAppointment = new Appointment({
      pet,
      vet,
      owner,
      date,
      reason
     });
     await newAppointment.save();
     res.status(201).json(newAppointment);
  }
  catch (error) {
    res.status(500).json({ message: 'Error creating appointment', error });
  }
};

const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('pet')
      .populate('vet')
      .populate('owner');
    res.json(appointments);
  }
  catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const role = req.user.role;
    if (role === 'owner' && status !== 'cancelled') {
      return res.status(403).json({ message: 'Owners can only cancel appointments' });
    }
    if(role === 'vet' && appointment.vet.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Vets can only update their own appointments' });
    }
    appointment.status = status;
    await appointment.save();
    res.json(appointment);
  }
  catch (error) {
    res.status(500).json({ message: 'Error updating appointment status', error });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
};
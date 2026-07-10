const Appointment = require('../models/appointments');
const Vet = require('../models/vets');

const ALLOWED_TRANSITIONS = {
  owner: {
    pending: ['cancelled'],
    confirmed: ['cancelled'],
  },
  vet: {
    pending: ['confirmed', 'rejected'],
    confirmed: ['completed', 'cancelled'],
  },
};

const getVetIdForUser = async (userId) => {
  const vetDoc = await Vet.findOne({ user: userId }).select('_id');
  return vetDoc?._id || null;
};

const createAppointment = async (req, res) => {
  try {
    const role = req.user.role;
    if (role !== 'owner') {
      return res.status(403).json({ message: 'Only owners can create appointments' });
    }

    const { pet, vet, date, reason } = req.body;

    if (!pet || !vet || !date) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const requestedDate = new Date(date);

    if (requestedDate < new Date()) {
      return res.status(400).json({ message: "You can't book an appointment in the past." });
    }

    const vetDoc = await Vet.findById(vet);

    if (!vetDoc) {
      return res.status(404).json({ message: 'Vet not found' });
    }

    if (vetDoc.verificationStatus !== 'verified') {
      return res.status(403).json({ message: 'This vet is not yet verified and cannot accept bookings' });
    }

    const conflict = await Appointment.findOne({
      vet,
      date: requestedDate,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (conflict) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    const newAppointment = new Appointment({
      pet,
      vet,
      owner: req.user.id,
      date: requestedDate,
      reason,
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
    const role = req.user.role;

    let filter;
    if (role === 'vet') {
      const vetId = await getVetIdForUser(req.user.id);
      if (!vetId) {
        return res.json([]);
      }
      filter = { vet: vetId };
    } else {
      filter = { owner: req.user.id };
    }

    const appointments = await Appointment.find(filter)
      .populate('pet')
      .populate('vet')
      .populate('owner');
    res.json(appointments);
  }
  catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error });
  }
};

const generateSlots = () => {
  const slots = [];
  for (let hour = 9; hour < 17; hour++) {
    slots.push(`${String(hour).padStart(2, '0')}:00`);
    slots.push(`${String(hour).padStart(2, '0')}:30`);
  }
  return slots;
};

const getAvailability = async (req, res) => {
  try {
    const { vet, date } = req.query;
    if (!vet || !date) {
      return res.status(400).json({ message: 'vet and date are required' });
    }

    const dayStart = new Date(`${date}T00:00:00`);
    const dayEnd = new Date(`${date}T23:59:59`);

    const booked = await Appointment.find({
      vet,
      date: { $gte: dayStart, $lte: dayEnd },
      status: { $in: ['pending', 'confirmed'] },
    }).select('date');

    const bookedTimes = booked.map((a) => a.date.toISOString());

    const slots = generateSlots().map((time) => ({
      time,
      available: !bookedTimes.includes(new Date(`${date}T${time}:00`).toISOString()),
    }));

    res.json({ slots });
  }
  catch (error) {
    res.status(500).json({ message: 'Error fetching availability', error });
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

    if (role === 'vet') {
      const vetId = await getVetIdForUser(req.user.id);
      if (!vetId || appointment.vet.toString() !== vetId.toString()) {
        return res.status(403).json({ message: 'Vets can only update their own appointments' });
      }
    }
    if (role === 'owner' && appointment.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Owners can only update their own appointments' });
    }
    const allowedNextStatuses = ALLOWED_TRANSITIONS[role]?.[appointment.status] || [];
    if (!allowedNextStatuses.includes(status)) {
      return res.status(403).json({ message: `Cannot change status from ${appointment.status} to ${status}` });
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
  getAvailability,
  updateAppointmentStatus,
};
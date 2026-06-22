const Pet = require('../models/pets');
const User = require('../models/users');
const Appointment = require('../models/appointments');

const userDashboard = async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user.id });
    const appointments = await Appointment.find({ owner: req.user.id })
      .populate('vet', 'name specialization')
      .populate('pet', 'name species breed');
    res.json({ pets, appointments });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }

};

const updateUserInfo = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { name, email }, { new: true })
    .select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User information updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  userDashboard,
  updateUserInfo,
};
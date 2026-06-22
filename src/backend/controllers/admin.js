const Vet = require('../models/vets');

const adminDashboard = async (req, res) => {
  try {
    const vets = await Vet.find().select('name licenseNumber specialization city isVerified');
    res.json(vets);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateVerifyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    const vet = await Vet.findByIdAndUpdate(id, { isVerified }, { new: true });
    if (!vet) {
      return res.status(404).json({ message: 'Vet not found' });
    }
    res.json({ message: 'Vet verification status updated', vet });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  adminDashboard,
  updateVerifyStatus,
};
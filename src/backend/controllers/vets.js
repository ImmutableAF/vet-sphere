const Vet = require('../models/vets');

const vetApplicationController = async (req, res) => {
  try {
    const { name, email, phone, licenseNumber, specialization, experienceYears, contactInfo, city, rating } = req.body;

    const newVet = new Vet({
      name,
      email,
      phone,
      licenseNumber,
      specialization,
      experienceYears,
      contactInfo,
      city,
      rating
    });
    await newVet.save();
    res.status(201).json(newVet);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getVetsController = async (req, res) => {
  try {
    const vets = await Vet.find();
    res.status(200).json(vets);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getVetByIdController = async (req, res) => {
  try {
    const vet = await Vet.findById(req.params.id);
    if (!vet) {
      return res.status(404).json({ message: 'Vet not found' });
    }
    res.status(200).json(vet);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  vetApplicationController,
  getVetsController,
  getVetByIdController,
};
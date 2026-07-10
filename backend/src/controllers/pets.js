const Pet = require('../models/pets');

const validatePetInput = ({ name, species, age, weight }) => {
  if (!name || !name.trim()) {
    return 'Pet name is required';
  }
  if (!species || !species.trim()) {
    return 'Species is required';
  }
  if (age !== undefined && age !== null && age !== '') {
    const numAge = Number(age);
    if (isNaN(numAge) || numAge < 0 || numAge > 50) {
      return 'Age must be a valid number between 0 and 50';
    }
  }
  if (weight !== undefined && weight !== null && weight !== '') {
    const numWeight = Number(weight);
    if (isNaN(numWeight) || numWeight <= 0) {
      return 'Weight must be a positive number';
    }
  }
  return null;
};

const createPetContoller = async (req, res) => {
  try {
    const { name, species, breed, age, weight } = req.body;

    const validationError = validatePetInput({ name, species, age, weight });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const newPet = new Pet({
      name,
      species,
      breed,
      age,
      owner: req.user.id,
      weight
    });
    await newPet.save();
    res.status(201).json(newPet);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getPetsController = async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user.id });
    res.status(200).json(pets);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getPetByIdController = async (req, res) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, owner: req.user.id });
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    res.status(200).json(pet);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updatePetController = async (req, res) => {
  try {
    const pet = await Pet.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      { new: true }
    );
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    res.status(200).json(pet);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deletePetController = async (req, res) => {
  try {
    const pet = await Pet.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    res.status(200).json({ message: 'Pet deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createPetContoller,
  getPetsController,
  getPetByIdController,
  updatePetController,
  deletePetController
};
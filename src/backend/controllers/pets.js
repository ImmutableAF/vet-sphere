
const createPetContoller = (req, res) => {
  res.send('Create pet endpoint');
};

const getPetsController = (req, res) => {
  res.send('Get pets endpoint');
};

const getPetByIdController = (req, res) => {
  res.send('Get pet by ID endpoint');
};

const updatePetController = (req, res) => {
  res.send('Update pet endpoint');
};

const deletePetController = (req, res) => {
  res.send('Delete pet endpoint');
};

module.exports = {
  createPetContoller,
  getPetsController,
  getPetByIdController,
  updatePetController,
  deletePetController
};
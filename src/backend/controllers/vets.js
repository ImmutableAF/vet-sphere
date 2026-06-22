
const vetApplicationController = (req, res) => {
  res.send('Vet application endpoint');
};

const getVetsController = (req, res) => {
  res.send('Get vets endpoint');
};

const getVetByIdController = (req, res) => {
  res.send('Get vet by ID endpoint');
};

module.exports = {
  vetApplicationController,
  getVetsController,
  getVetByIdController,
};
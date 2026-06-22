const express = require('express');
const router = express.Router();

const {
  createPetContoller,
  getPetsController,
  getPetByIdController,
  updatePetController,
  deletePetController
} = require('../controllers/pets');

router.post('/', createPetContoller);

router.get('/', getPetsController);

router.get('/:id', getPetByIdController);

router.put('/:id', updatePetController);

router.delete('/:id', deletePetController);

module.exports = router;
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth');

const {
  createPetContoller,
  getPetsController,
  getPetByIdController,
  updatePetController,
  deletePetController
} = require('../controllers/pets');

router.post('/', authMiddleware, createPetContoller);

router.get('/', authMiddleware, getPetsController);

router.get('/:id', authMiddleware, getPetByIdController);

router.put('/:id', authMiddleware, updatePetController);

router.delete('/:id', authMiddleware, deletePetController);

module.exports = router;
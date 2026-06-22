const express = require('express');
const router = express.Router();

const {
  vetApplicationController,
  getVetsController,
  getVetByIdController,
} = require('../controllers/vets');

router.post('/apply', vetApplicationController);

router.get('/', getVetsController);

router.get('/:id', getVetByIdController);

module.exports = router;
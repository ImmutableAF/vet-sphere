const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth');

const {
  vetApplicationController,
  getVetsController,
  getVetByIdController,
} = require('../controllers/vets');

router.post('/apply', authMiddleware, vetApplicationController);

router.get('/', authMiddleware, getVetsController);

router.get('/:id', authMiddleware, getVetByIdController);

module.exports = router;
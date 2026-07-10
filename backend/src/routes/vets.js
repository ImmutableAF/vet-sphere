const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const {
  vetApplicationController,
  getVetsController,
  getVetByIdController,
  getOwnVetProfileController,
  updateOwnVetProfileController,
  submitVerification,
} = require('../controllers/vets');

router.post('/apply', authMiddleware, vetApplicationController);

router.get('/', authMiddleware, getVetsController);

router.get('/me', authMiddleware, getOwnVetProfileController);

router.patch('/me', authMiddleware, updateOwnVetProfileController);

router.post('/verify', authMiddleware, upload.single('proofDocument'), submitVerification);

router.get('/:id', authMiddleware, getVetByIdController);

module.exports = router;
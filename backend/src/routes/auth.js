const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middlewares/auth');

const { loginController, registerController, requestAccountDeletionController } = require('../controllers/auth');

router.post('/login', loginController);

router.post('/register', registerController);

router.delete('/delete-account', authMiddleware, requestAccountDeletionController);

module.exports = router;
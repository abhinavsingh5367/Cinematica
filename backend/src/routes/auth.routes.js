const express = require('express');
const router = express.Router();
const {
  register,
  authenticate,
  getMe,
  refreshToken,
} = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

// Public routes
router.post('/register', register);
router.post('/authenticate', authenticate);
router.post('/login', authenticate);
router.post('/refresh-token', refreshToken);
router.post('/refresh', refreshToken);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;

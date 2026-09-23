const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
} = require('../controllers/booking.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/', protect, createBooking);
router.get('/my', protect, getUserBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;

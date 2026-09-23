const Booking = require('../models/Booking.model');
const Show = require('../models/Show.model');

// @desc    Create new booking (Seat reservation + Ticket generation)
// @route   POST /api/bookings, POST /api/v1/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { showId, seats, totalAmount } = req.body;
    const userId = req.user ? req.user._id : req.body.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Please login to book tickets' });
    }

    if (!showId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Show ID and at least one selected seat are required',
      });
    }

    // Find the show
    const show = await Show.findById(showId).populate('movie').populate('theater');
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    // Check if any requested seats are already booked
    const alreadyBooked = seats.filter((s) => show.bookedSeats.includes(s));
    if (alreadyBooked.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Seats already booked: ${alreadyBooked.join(', ')}`,
      });
    }

    // Reserve seats on show
    show.bookedSeats.push(...seats);
    await show.save();

    // Calculate total if not provided
    const calculatedAmount = totalAmount || seats.length * show.price;

    // Create booking
    const booking = await Booking.create({
      user: userId,
      show: show._id,
      movie: show.movie._id,
      theater: show.theater._id,
      seats,
      totalAmount: calculatedAmount,
      paymentStatus: 'PAID',
      bookingStatus: 'CONFIRMED',
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('movie')
      .populate('theater')
      .populate('show')
      .populate('user', 'firstname lastname email');

    return res.status(201).json({
      success: true,
      message: 'Tickets booked successfully!',
      booking: populatedBooking,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get bookings for logged-in user
// @route   GET /api/bookings/my, GET /api/v1/bookings/my
// @access  Private
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : req.query.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const bookings = await Booking.find({ user: userId })
      .populate('movie')
      .populate('theater')
      .populate('show')
      .sort({ createdAt: -1 });

    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get booking by ID (Ticket confirmation view)
// @route   GET /api/bookings/:id, GET /api/v1/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('movie')
      .populate('theater')
      .populate('show')
      .populate('user', 'firstname lastname email');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    return res.status(200).json(booking);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel, PUT /api/v1/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Release seats
    const show = await Show.findById(booking.show);
    if (show) {
      show.bookedSeats = show.bookedSeats.filter((s) => !booking.seats.includes(s));
      await show.save();
    }

    booking.bookingStatus = 'CANCELLED';
    booking.paymentStatus = 'REFUNDED';
    await booking.save();

    return res.status(200).json({ success: true, message: 'Booking cancelled successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
};

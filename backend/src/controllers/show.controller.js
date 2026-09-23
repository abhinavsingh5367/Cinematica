const Show = require('../models/Show.model');
const Movie = require('../models/Movie.model');
const Theater = require('../models/Theater.model');

// @desc    Get shows with optional filters (movie, theater, date)
// @route   GET /api/shows, GET /api/v1/shows
// @access  Public
const getShows = async (req, res) => {
  try {
    const { movieId, theaterId, date } = req.query;
    const filter = {};

    if (movieId) {
      if (movieId.match(/^[0-9a-fA-F]{24}$/)) {
        filter.movie = movieId;
      } else {
        const movie = await Movie.findOne({ title: new RegExp(`^${movieId}$`, 'i') });
        if (movie) filter.movie = movie._id;
      }
    }

    if (theaterId) {
      filter.theater = theaterId;
    }

    if (date) {
      filter.date = date;
    }

    const shows = await Show.find(filter)
      .populate('movie', 'title genre duration posterfilename releaseDate')
      .populate('theater', 'name location city screenType rows seatsPerRow totalSeats')
      .sort({ date: 1, showTime: 1 });

    return res.status(200).json(shows);
  } catch (error) {
    console.error('Error fetching shows:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single show details (seat layout and booked seats)
// @route   GET /api/shows/:id, GET /api/v1/shows/:id
// @access  Public
const getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movie')
      .populate('theater');

    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    return res.status(200).json(show);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new show
// @route   POST /api/shows, POST /api/v1/shows
// @access  Private / Admin
const createShow = async (req, res) => {
  try {
    const { movie, theater, showTime, date, price } = req.body;
    const newShow = await Show.create({
      movie,
      theater,
      showTime,
      date: date || new Date().toISOString().split('T')[0],
      price: price || 12.5,
      bookedSeats: [],
    });
    return res.status(201).json(newShow);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getShows,
  getShowById,
  createShow,
};

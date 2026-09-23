const Theater = require('../models/Theater.model');

// @desc    Get all theaters
// @route   GET /api/theaters, GET /api/v1/theaters
// @access  Public
const getAllTheaters = async (req, res) => {
  try {
    const { city } = req.query;
    const filter = city ? { city: new RegExp(`^${city}$`, 'i') } : {};
    const theaters = await Theater.find(filter);
    return res.status(200).json(theaters);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single theater by ID
// @route   GET /api/theaters/:id, GET /api/v1/theaters/:id
// @access  Public
const getTheaterById = async (req, res) => {
  try {
    const theater = await Theater.findById(req.params.id);
    if (!theater) {
      return res.status(404).json({ success: false, message: 'Theater not found' });
    }
    return res.status(200).json(theater);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new theater
// @route   POST /api/theaters, POST /api/v1/theaters
// @access  Private / Admin
const createTheater = async (req, res) => {
  try {
    const theater = await Theater.create(req.body);
    return res.status(201).json(theater);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllTheaters,
  getTheaterById,
  createTheater,
};

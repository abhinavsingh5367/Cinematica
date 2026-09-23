const express = require('express');
const router = express.Router();
const {
  getAllTheaters,
  getTheaterById,
  createTheater,
} = require('../controllers/theater.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

router.get('/', getAllTheaters);
router.get('/:id', getTheaterById);
router.post('/', protect, authorize('ADMIN'), createTheater);

module.exports = router;

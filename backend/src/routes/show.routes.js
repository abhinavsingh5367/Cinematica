const express = require('express');
const router = express.Router();
const {
  getShows,
  getShowById,
  createShow,
} = require('../controllers/show.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

router.get('/', getShows);
router.get('/:id', getShowById);
router.post('/', protect, authorize('ADMIN'), createShow);

module.exports = router;

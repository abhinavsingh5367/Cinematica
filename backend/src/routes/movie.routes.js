const express = require('express');
const router = express.Router();
const {
  getAllMovies,
  fetchByGenre,
  fetchByMovieName,
  fetchMovieByLanguage,
  getMovieById,
  addMovie,
  uploadFile,
  deleteMovie,
} = require('../controllers/movie.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

// Legacy Spring Boot compatibility routes
router.get('/fetchGenre/:genre', fetchByGenre);
router.get('/fetchMovieName/:moviename', fetchByMovieName);
router.get('/fetchMovieBylanguage/:language', fetchMovieByLanguage);
router.post('/addMovie', addMovie);
router.post('/upload', uploadFile);

// RESTful routes
router.get('/', getAllMovies);
router.get('/:id', getMovieById);
router.post('/', addMovie);
router.delete('/:id', protect, authorize('ADMIN'), deleteMovie);

module.exports = router;

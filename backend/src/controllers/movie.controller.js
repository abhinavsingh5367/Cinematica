const mongoose = require('mongoose');
const Movie = require('../models/Movie.model');
const { sampleMovies } = require('../config/seed');

// In-memory movies fallback cache
let inMemoryMovies = sampleMovies.map((m, idx) => ({
  ...m,
  _id: 'm-' + (idx + 1),
  id: 'm-' + (idx + 1),
  movie_id: 'm-' + (idx + 1),
  movie_title: m.title,
  movielink: m.moviefilename,
  posterlink: m.posterfilename,
}));

// Helper to format movie for Spring Boot frontend response
const formatMovieForFrontend = (movie) => {
  return {
    id: movie._id || movie.id,
    _id: movie._id || movie.id,
    movie_id: movie._id || movie.id,
    title: movie.title,
    movie_title: movie.title,
    description: movie.description || movie.Description,
    rating: movie.rating,
    genre: movie.genre,
    language: movie.language || movie.Language,
    duration: movie.duration,
    releaseDate: movie.releaseDate || movie.release_date,
    release_date: movie.releaseDate || movie.release_date,
    movielink: movie.movielink || movie.moviefilename,
    posterlink: movie.posterlink || movie.posterfilename,
    trending: movie.trending,
  };
};

// @desc    Get all movies with optional filters
// @route   GET /api/v1/movies, GET /api/movies
// @access  Public
const getAllMovies = async (req, res) => {
  try {
    const { genre, language, search, trending } = req.query;

    if (mongoose.connection.readyState === 1) {
      const filter = {};
      if (genre) filter.genre = new RegExp(`^${genre}$`, 'i');
      if (language) filter.language = new RegExp(`^${language}$`, 'i');
      if (trending !== undefined) filter.trending = trending === 'true';
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { genre: { $regex: search, $options: 'i' } },
        ];
      }
      const movies = await Movie.find(filter).sort({ createdAt: -1 });
      return res.status(200).json(movies.map(formatMovieForFrontend));
    }

    // In-memory fallback
    let list = [...inMemoryMovies];
    if (genre) list = list.filter((m) => m.genre.toLowerCase() === genre.toLowerCase());
    if (language) list = list.filter((m) => m.language.toLowerCase() === language.toLowerCase());
    if (trending !== undefined) list = list.filter((m) => m.trending === (trending === 'true'));
    if (search) {
      const s = search.toLowerCase();
      list = list.filter((m) => m.title.toLowerCase().includes(s) || m.genre.toLowerCase().includes(s));
    }
    return res.status(200).json(list.map(formatMovieForFrontend));
  } catch (error) {
    return res.status(200).json(inMemoryMovies.map(formatMovieForFrontend));
  }
};

// @desc    Fetch movies by genre (Spring Boot compatibility)
// @route   GET /api/v1/movies/fetchGenre/:genre, GET /api/movies/fetchGenre/:genre
// @access  Public
const fetchByGenre = async (req, res) => {
  try {
    const { genre } = req.params;

    const cleanGenre = genre.replace(/[\s_-]/g, '').toLowerCase();

    if (mongoose.connection.readyState === 1) {
      const movies = await Movie.find({
        genre: { $regex: new RegExp(`^${genre.replace(/([A-Z])/g, ' $1').trim()}|${genre}$`, 'i') },
      });
      return res.status(200).json(movies.map(formatMovieForFrontend));
    }

    const matches = inMemoryMovies.filter(
      (m) => m.genre.replace(/[\s_-]/g, '').toLowerCase() === cleanGenre
    );
    return res.status(200).json(matches.map(formatMovieForFrontend));
  } catch (error) {
    return res.status(200).json([]);
  }
};

// @desc    Fetch movies by name / title (Spring Boot compatibility)
// @route   GET /api/v1/movies/fetchMovieName/:moviename, GET /api/movies/fetchMovieName/:moviename
// @access  Public
const fetchByMovieName = async (req, res) => {
  try {
    const { moviename } = req.params;

    if (mongoose.connection.readyState === 1) {
      let movies = [];
      if (moviename.match(/^[0-9a-fA-F]{24}$/)) {
        const byId = await Movie.findById(moviename);
        if (byId) movies = [byId];
      }
      if (movies.length === 0) {
        movies = await Movie.find({
          title: { $regex: new RegExp(moviename, 'i') },
        });
      }
      return res.status(200).json(movies.map(formatMovieForFrontend));
    }

    const s = moviename.toLowerCase();
    const matches = inMemoryMovies.filter(
      (m) => m.title.toLowerCase().includes(s) || m.id === moviename
    );
    return res.status(200).json(matches.map(formatMovieForFrontend));
  } catch (error) {
    return res.status(200).json([]);
  }
};

// @desc    Fetch movies by language (Spring Boot compatibility)
// @route   GET /api/v1/movies/fetchMovieBylanguage/:language, GET /api/movies/fetchMovieBylanguage/:language
// @access  Public
const fetchMovieByLanguage = async (req, res) => {
  try {
    const { language } = req.params;

    if (mongoose.connection.readyState === 1) {
      const movies = await Movie.find({
        language: { $regex: new RegExp(`^${language}$`, 'i') },
      });
      return res.status(200).json(movies.map(formatMovieForFrontend));
    }

    const matches = inMemoryMovies.filter(
      (m) => m.language.toLowerCase() === language.toLowerCase()
    );
    return res.status(200).json(matches.map(formatMovieForFrontend));
  } catch (error) {
    return res.status(200).json([]);
  }
};

// @desc    Get single movie by ID
// @route   GET /api/v1/movies/:id, GET /api/movies/:id
// @access  Public
const getMovieById = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const movie = await Movie.findById(req.params.id);
      if (movie) return res.status(200).json(formatMovieForFrontend(movie));
    }

    const match = inMemoryMovies.find(
      (m) => m.id === req.params.id || m.title.toLowerCase() === req.params.id.toLowerCase()
    );
    if (match) return res.status(200).json(formatMovieForFrontend(match));

    return res.status(404).json({ success: false, message: 'Movie not found' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add movie
// @route   POST /api/v1/movies/addMovie, POST /api/movies
// @access  Public
const addMovie = async (req, res) => {
  try {
    const body = req.body;
    if (mongoose.connection.readyState === 1) {
      const movie = await Movie.create(body);
      return res.status(201).json(formatMovieForFrontend(movie));
    }

    const created = {
      ...body,
      _id: 'm-' + (inMemoryMovies.length + 1),
      id: 'm-' + (inMemoryMovies.length + 1),
      movie_id: 'm-' + (inMemoryMovies.length + 1),
      movielink: body.moviefilename,
      posterlink: body.posterfilename,
    };
    inMemoryMovies.push(created);
    return res.status(201).json(formatMovieForFrontend(created));
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Upload file placeholder
// @route   POST /api/v1/movies/upload, POST /api/movies/upload
// @access  Public
const uploadFile = async (req, res) => {
  const filename = `upload_${Date.now()}.mp4`;
  return res.status(200).send(`File uploaded : ${filename}`);
};

// @desc    Delete movie
// @route   DELETE /api/v1/movies/:id, DELETE /api/movies/:id
// @access  Private / Admin
const deleteMovie = async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    await Movie.findByIdAndDelete(req.params.id);
  } else {
    inMemoryMovies = inMemoryMovies.filter((m) => m.id !== req.params.id);
  }
  return res.status(200).json({ success: true, message: 'Movie deleted successfully' });
};

module.exports = {
  getAllMovies,
  fetchByGenre,
  fetchByMovieName,
  fetchMovieByLanguage,
  getMovieById,
  addMovie,
  uploadFile,
  deleteMovie,
};

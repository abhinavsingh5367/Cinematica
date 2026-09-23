const Movie = require('../models/Movie.model');

// Helper to format movie for Spring Boot frontend response
const formatMovieForFrontend = (movie) => {
  return {
    id: movie._id,
    _id: movie._id,
    movie_id: movie._id,
    title: movie.title,
    movie_title: movie.title,
    Description: movie.description,
    description: movie.description,
    rating: movie.rating,
    genre: movie.genre,
    language: movie.language,
    Language: movie.language,
    duration: movie.duration,
    releaseDate: movie.releaseDate,
    release_date: movie.releaseDate,
    movielink: movie.movielink,
    posterlink: movie.posterlink,
    trending: movie.trending,
  };
};

// @desc    Get all movies with optional filters
// @route   GET /api/v1/movies, GET /api/movies
// @access  Public
const getAllMovies = async (req, res) => {
  try {
    const { genre, language, search, trending } = req.query;
    const filter = {};

    if (genre) {
      filter.genre = new RegExp(`^${genre}$`, 'i');
    }
    if (language) {
      filter.language = new RegExp(`^${language}$`, 'i');
    }
    if (trending !== undefined) {
      filter.trending = trending === 'true';
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { genre: { $regex: search, $options: 'i' } },
      ];
    }

    const movies = await Movie.find(filter).sort({ createdAt: -1 });
    const formatted = movies.map(formatMovieForFrontend);
    return res.status(200).json(formatted);
  } catch (error) {
    console.error('Error fetching movies:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Fetch movies by genre (Spring Boot compatibility)
// @route   GET /api/v1/movies/fetchGenre/:genre, GET /api/movies/fetchGenre/:genre
// @access  Public
const fetchByGenre = async (req, res) => {
  try {
    const { genre } = req.params;
    // Case-insensitive regex match
    const movies = await Movie.find({
      genre: { $regex: new RegExp(`^${genre}$`, 'i') },
    });

    const responses = movies.map((movie) => ({
      id: movie._id,
      _id: movie._id,
      movie_id: movie._id,
      title: movie.title,
      movie_title: movie.title,
      posterlink: movie.posterlink,
      movielink: movie.movielink,
      rating: movie.rating,
      genre: movie.genre,
      duration: movie.duration,
      Description: movie.description,
    }));

    return res.status(200).json(responses);
  } catch (error) {
    console.error('Error fetching by genre:', error);
    return res.status(500).json([]);
  }
};

// @desc    Fetch movies by name / title (Spring Boot compatibility)
// @route   GET /api/v1/movies/fetchMovieName/:moviename, GET /api/movies/fetchMovieName/:moviename
// @access  Public
const fetchByMovieName = async (req, res) => {
  try {
    const { moviename } = req.params;
    let movies = [];

    // Check if valid ObjectId or title match
    if (moviename.match(/^[0-9a-fA-F]{24}$/)) {
      const byId = await Movie.findById(moviename);
      if (byId) movies = [byId];
    }

    if (movies.length === 0) {
      movies = await Movie.find({
        title: { $regex: new RegExp(moviename, 'i') },
      });
    }

    const formatted = movies.map(formatMovieForFrontend);
    return res.status(200).json(formatted);
  } catch (error) {
    console.error('Error fetching movie by name:', error);
    return res.status(500).json([]);
  }
};

// @desc    Fetch movies by language (Spring Boot compatibility)
// @route   GET /api/v1/movies/fetchMovieBylanguage/:language, GET /api/movies/fetchMovieBylanguage/:language
// @access  Public
const fetchMovieByLanguage = async (req, res) => {
  try {
    const { language } = req.params;
    const movies = await Movie.find({
      language: { $regex: new RegExp(`^${language}$`, 'i') },
    });

    const formatted = movies.map((movie) => ({
      id: movie._id,
      _id: movie._id,
      movie_id: movie._id,
      title: movie.title,
      movie_title: movie.title,
      posterlink: movie.posterlink,
      movielink: movie.movielink,
      language: movie.language,
      Language: movie.language,
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error('Error fetching movie by language:', error);
    return res.status(500).json([]);
  }
};

// @desc    Get single movie by ID
// @route   GET /api/v1/movies/:id, GET /api/movies/:id
// @access  Public
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    return res.status(200).json(formatMovieForFrontend(movie));
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add movie
// @route   POST /api/v1/movies/addMovie, POST /api/movies
// @access  Public (or Admin protected)
const addMovie = async (req, res) => {
  try {
    const {
      title,
      description,
      rating,
      genre,
      language,
      duration,
      releaseDate,
      moviefilename,
      posterfilename,
      trending,
    } = req.body;

    const movie = await Movie.create({
      title,
      description: description || 'No description provided.',
      rating: Number(rating) || 0,
      genre: genre || 'General',
      language: language || 'English',
      duration: duration || '2h',
      releaseDate: releaseDate || '2024',
      moviefilename: moviefilename || '',
      posterfilename: posterfilename || '',
      trending: trending === 'true' || trending === true,
    });

    return res.status(201).json(formatMovieForFrontend(movie));
  } catch (error) {
    console.error('Error adding movie:', error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Upload file placeholder
// @route   POST /api/v1/movies/upload, POST /api/movies/upload
// @access  Public
const uploadFile = async (req, res) => {
  try {
    const filename = `upload_${Date.now()}.mp4`;
    return res.status(200).send(`File uploaded : ${filename}`);
  } catch (error) {
    return res.status(500).send('Upload failed');
  }
};

// @desc    Delete movie
// @route   DELETE /api/v1/movies/:id, DELETE /api/movies/:id
// @access  Private / Admin
const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    return res.status(200).json({ success: true, message: 'Movie deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
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

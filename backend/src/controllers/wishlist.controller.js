const Wishlist = require('../models/Wishlist.model');
const Movie = require('../models/Movie.model');

// Helper to extract movie ObjectId if given id or title
const resolveMovie = async (identifier) => {
  if (identifier && identifier.match(/^[0-9a-fA-F]{24}$/)) {
    const movie = await Movie.findById(identifier);
    if (movie) return movie;
  }
  return await Movie.findOne({ title: new RegExp(`^${identifier}$`, 'i') });
};

// @desc    Add movie to wishlist
// @route   POST /api/v1/wishlist/AddtoWishList/:Mid, POST /api/wishlist/:Mid
// @access  Private
const addToWishList = async (req, res) => {
  try {
    const { Mid } = req.params;
    const userId = req.user ? req.user._id : req.body.userId;

    if (!userId) {
      return res.status(401).send('User not authenticated');
    }

    const movie = await resolveMovie(Mid);
    if (!movie) {
      return res.status(404).send('Movie not found');
    }

    // Check if already in wishlist
    const existing = await Wishlist.findOne({ user: userId, movie: movie._id });
    if (existing) {
      return res.status(200).send('Movie already in wishlist');
    }

    await Wishlist.create({
      user: userId,
      movie: movie._id,
    });

    return res.status(200).send('Movie added to wishlist successfully');
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return res.status(500).send(`Failed to add to wish list: ${error.message}`);
  }
};

// @desc    Remove movie from wishlist by Movie ID
// @route   POST /api/v1/wishlist/RemovefromWishList/:Mid, DELETE /api/wishlist/movie/:Mid
// @access  Private
const removeFromWishList = async (req, res) => {
  try {
    const { Mid } = req.params;
    const userId = req.user ? req.user._id : req.body.userId;

    const movie = await resolveMovie(Mid);
    if (movie) {
      await Wishlist.findOneAndDelete({ user: userId, movie: movie._id });
    } else {
      // mid might be wishlist id
      await Wishlist.findByIdAndDelete(Mid);
    }

    return res.status(200).send('Removed from Wishlist successfully');
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return res.status(500).send(`Failed to remove from wish list: ${error.message}`);
  }
};

// @desc    Remove wishlist entry by Wishlist ID or Movie ID (matches watchlist.js DELETE call)
// @route   DELETE /api/v1/wishlist/:id, DELETE /api/wishlist/:id
// @access  Private
const deleteWishlistItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user._id : req.body.userId;

    // Try deleting by Wishlist ID, or Movie ID
    let deleted = await Wishlist.findOneAndDelete({ _id: id, user: userId });
    if (!deleted) {
      deleted = await Wishlist.findOneAndDelete({ movie: id, user: userId });
    }
    if (!deleted) {
      // If no user context, delete by id
      deleted = await Wishlist.findByIdAndDelete(id);
    }

    return res.status(200).json({ success: true, message: 'Removed from Wishlist successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    List all movies in user's wishlist
// @route   GET /api/v1/wishlist/ListMoviesinWishlist, GET /api/wishlist
// @access  Private
const listMoviesInWishlist = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : req.query.userId;
    if (!userId) {
      return res.status(401).json([]);
    }

    const items = await Wishlist.find({ user: userId }).populate('movie');
    const movies = items
      .filter((item) => item.movie != null)
      .map((item) => ({
        id: item.movie._id,
        _id: item.movie._id,
        movie_id: item.movie._id,
        wishlist_id: item._id,
        title: item.movie.title,
        movie_title: item.movie.title,
        posterlink: item.movie.posterlink,
        movielink: item.movie.movielink,
        rating: item.movie.rating,
        genre: item.movie.genre,
        language: item.movie.language,
        Description: item.movie.description,
      }));

    return res.status(200).json(movies);
  } catch (error) {
    console.error('Error listing wishlist:', error);
    return res.status(500).json([]);
  }
};

module.exports = {
  addToWishList,
  removeFromWishList,
  deleteWishlistItem,
  listMoviesInWishlist,
};

const express = require('express');
const router = express.Router();
const {
  addToWishList,
  removeFromWishList,
  deleteWishlistItem,
  listMoviesInWishlist,
} = require('../controllers/wishlist.controller');
const { protect } = require('../middlewares/auth.middleware');

// Legacy Spring Boot compatibility routes
router.post('/AddtoWishList/:Mid', protect, addToWishList);
router.post('/RemovefromWishList/:Mid', protect, removeFromWishList);
router.get('/ListMoviesinWishlist', protect, listMoviesInWishlist);

// RESTful routes
router.post('/:Mid', protect, addToWishList);
router.delete('/:id', protect, deleteWishlistItem);
router.get('/', protect, listMoviesInWishlist);

module.exports = router;

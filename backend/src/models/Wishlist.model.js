const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Prevent duplicate wishlist entries for same user and movie
wishlistSchema.index({ user: 1, movie: 1 }, { unique: true });

wishlistSchema.virtual('movieID').get(function () {
  return this.movie;
});

wishlistSchema.virtual('UserID').get(function () {
  return this.user;
});

module.exports = mongoose.model('Wishlist', wishlistSchema);

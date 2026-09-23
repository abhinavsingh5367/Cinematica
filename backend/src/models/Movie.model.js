const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      trim: true,
      index: true,
    },
    language: {
      type: String,
      required: [true, 'Language is required'],
      trim: true,
      index: true,
    },
    duration: {
      type: String,
      default: '2h 15m',
    },
    releaseDate: {
      type: String,
      default: '2024',
    },
    moviefilename: {
      type: String,
      default: '',
    },
    posterfilename: {
      type: String,
      default: '',
    },
    trending: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual properties for backward compatibility with Spring Boot API and React Frontend
movieSchema.virtual('movie_title').get(function () {
  return this.title;
});

movieSchema.virtual('movie_id').get(function () {
  return this._id;
});

movieSchema.virtual('Description').get(function () {
  return this.description;
});

movieSchema.virtual('Language').get(function () {
  return this.language;
});

movieSchema.virtual('release_date').get(function () {
  return this.releaseDate;
});

movieSchema.virtual('movielink').get(function () {
  if (this.moviefilename && (this.moviefilename.startsWith('http://') || this.moviefilename.startsWith('https://'))) {
    return this.moviefilename;
  }
  return this.moviefilename || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
});

movieSchema.virtual('posterlink').get(function () {
  if (this.posterfilename && (this.posterfilename.startsWith('http://') || this.posterfilename.startsWith('https://'))) {
    return this.posterfilename;
  }
  return this.posterfilename || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=60';
});

module.exports = mongoose.model('Movie', movieSchema);

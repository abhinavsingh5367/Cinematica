const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Theater name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      default: 'New York',
    },
    screenType: {
      type: String,
      enum: ['IMAX 3D', '4DX', 'Dolby Cinema', 'Standard 2D'],
      default: 'IMAX 3D',
    },
    totalSeats: {
      type: Number,
      default: 60,
    },
    rows: {
      type: [String],
      default: ['A', 'B', 'C', 'D', 'E', 'F'],
    },
    seatsPerRow: {
      type: Number,
      default: 10,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model('Theater', theaterSchema);

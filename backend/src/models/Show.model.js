const mongoose = require('mongoose');

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Movie reference is required'],
    },
    theater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theater',
      required: [true, 'Theater reference is required'],
    },
    showTime: {
      type: String,
      required: [true, 'Show time is required'],
      default: '07:00 PM',
    },
    date: {
      type: String,
      required: [true, 'Show date is required'],
      default: () => new Date().toISOString().split('T')[0],
    },
    price: {
      type: Number,
      required: [true, 'Ticket price is required'],
      default: 12.5,
    },
    bookedSeats: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

showSchema.virtual('availableSeatsCount').get(function () {
  const total = (this.theater && this.theater.totalSeats) ? this.theater.totalSeats : 60;
  return total - (this.bookedSeats ? this.bookedSeats.length : 0);
});

module.exports = mongoose.model('Show', showSchema);

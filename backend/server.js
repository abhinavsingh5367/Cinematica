const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const seedDatabase = require('./src/config/seed');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB().then(() => {
  seedDatabase();
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware in development
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Import route handlers
const authRoutes = require('./src/routes/auth.routes');
const movieRoutes = require('./src/routes/movie.routes');
const wishlistRoutes = require('./src/routes/wishlist.routes');
const theaterRoutes = require('./src/routes/theater.routes');
const showRoutes = require('./src/routes/show.routes');
const bookingRoutes = require('./src/routes/booking.routes');

// Mount routes with dual compatibility (both /api/v1/* and /api/*)
app.use('/api/v1/auth', authRoutes);
app.use('/api/auth', authRoutes);

app.use('/api/v1/movies', movieRoutes);
app.use('/api/movies', movieRoutes);

app.use('/api/v1/wishlist', wishlistRoutes);
app.use('/api/wishlist', wishlistRoutes);

app.use('/api/v1/theaters', theaterRoutes);
app.use('/api/theaters', theaterRoutes);

app.use('/api/v1/shows', showRoutes);
app.use('/api/shows', showRoutes);

app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date(),
    stack: 'Cinematica MERN Stack',
    version: '1.0.0',
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Cinematica Backend API (Node.js + Express + MongoDB)',
    documentation: {
      auth: ['/api/v1/auth/register', '/api/v1/auth/authenticate'],
      movies: ['/api/v1/movies', '/api/v1/movies/fetchGenre/:genre', '/api/v1/movies/fetchMovieName/:moviename'],
      wishlist: ['/api/v1/wishlist/ListMoviesinWishlist', '/api/v1/wishlist/AddtoWishList/:Mid'],
      bookings: ['/api/bookings', '/api/bookings/my'],
      theaters: ['/api/theaters'],
      shows: ['/api/shows'],
    },
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`Cinematica Express Server running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}`);
  console.log(`===============================================`);
});

module.exports = app;

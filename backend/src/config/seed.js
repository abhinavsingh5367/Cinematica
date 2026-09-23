const Movie = require('../models/Movie.model');
const Theater = require('../models/Theater.model');
const Show = require('../models/Show.model');
const User = require('../models/User.model');

const sampleMovies = [
  {
    title: 'Interstellar',
    description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    rating: 9,
    genre: 'Science Fiction',
    language: 'English',
    duration: '2h 49m',
    releaseDate: '2014',
    moviefilename: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    posterfilename: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80',
    trending: true,
  },
  {
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    rating: 9,
    genre: 'Action',
    language: 'English',
    duration: '2h 32m',
    releaseDate: '2008',
    moviefilename: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    posterfilename: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    trending: true,
  },
  {
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    rating: 9,
    genre: 'Thriller',
    language: 'English',
    duration: '2h 28m',
    releaseDate: '2010',
    moviefilename: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    posterfilename: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    trending: true,
  },
  {
    title: 'The Grand Budapest Hotel',
    description: 'A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy in the hotel\'s glorious years under an exceptional concierge.',
    rating: 8,
    genre: 'Comedy',
    language: 'English',
    duration: '1h 39m',
    releaseDate: '2014',
    moviefilename: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    posterfilename: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    trending: false,
  },
  {
    title: 'Oppenheimer',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
    rating: 9,
    genre: 'Drama',
    language: 'English',
    duration: '3h 00m',
    releaseDate: '2023',
    moviefilename: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    posterfilename: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&auto=format&fit=crop&q=80',
    trending: true,
  },
  {
    title: 'Dangal',
    description: 'Former wrestler Mahavir Singh Phogat and his two wrestler daughters struggle towards glory at the Commonwealth Games in the face of societal oppression.',
    rating: 9,
    genre: 'Drama',
    language: 'Hindi',
    duration: '2h 41m',
    releaseDate: '2016',
    moviefilename: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    posterfilename: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80',
    trending: true,
  },
  {
    title: 'Kantara',
    description: 'When greed paves the way for betrayal, scheming and murder, a young tribal man reluctantly inherits the tradition of his ancestors to seek justice.',
    rating: 8,
    genre: 'Action',
    language: 'Kannada',
    duration: '2h 28m',
    releaseDate: '2022',
    moviefilename: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    posterfilename: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=80',
    trending: false,
  },
  {
    title: 'Sairat',
    description: 'Two young college students from differing castes fall in love, igniting violence and hostility among their families.',
    rating: 8,
    genre: 'Drama',
    language: 'Marathi',
    duration: '2h 54m',
    releaseDate: '2016',
    moviefilename: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    posterfilename: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800&auto=format&fit=crop&q=80',
    trending: false,
  },
];

const sampleTheaters = [
  {
    name: 'Cinematica IMAX Cinema',
    location: 'Central Plaza, Broadway',
    city: 'New York',
    screenType: 'IMAX 3D',
    totalSeats: 60,
    rows: ['A', 'B', 'C', 'D', 'E', 'F'],
    seatsPerRow: 10,
  },
  {
    name: 'Grand Dolby Atmos Multiplex',
    location: 'Sunset Boulevard',
    city: 'Los Angeles',
    screenType: 'Dolby Cinema',
    totalSeats: 60,
    rows: ['A', 'B', 'C', 'D', 'E', 'F'],
    seatsPerRow: 10,
  },
  {
    name: 'Cinematica 4DX Screen',
    location: 'Downtown Hub',
    city: 'Chicago',
    screenType: '4DX',
    totalSeats: 60,
    rows: ['A', 'B', 'C', 'D', 'E', 'F'],
    seatsPerRow: 10,
  },
];

const seedDatabase = async () => {
  try {
    const movieCount = await Movie.countDocuments();
    if (movieCount === 0) {
      console.log('[Seed] Seeding sample movies...');
      const createdMovies = await Movie.insertMany(sampleMovies);

      console.log('[Seed] Seeding sample theaters...');
      const createdTheaters = await Theater.insertMany(sampleTheaters);

      console.log('[Seed] Seeding sample shows...');
      const shows = [];
      const showTimes = ['10:30 AM', '02:00 PM', '06:30 PM', '09:45 PM'];
      const today = new Date().toISOString().split('T')[0];

      for (const movie of createdMovies) {
        for (const theater of createdTheaters) {
          for (const showTime of showTimes) {
            shows.push({
              movie: movie._id,
              theater: theater._id,
              showTime,
              date: today,
              price: 14.5,
              bookedSeats: ['A1', 'A2', 'C5'],
            });
          }
        }
      }
      await Show.insertMany(shows);
      console.log('[Seed] Initial data seeded successfully!');
    }
  } catch (error) {
    console.warn('[Seed Warning]: Could not seed initial database:', error.message);
  }
};

module.exports = seedDatabase;

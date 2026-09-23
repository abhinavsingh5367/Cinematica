import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to get token with support for both storage keys
export const getAuthToken = () => {
  return localStorage.getItem('access_token') || localStorage.getItem('access_toke') || '';
};

// Set token in localStorage
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('access_token', token);
    localStorage.setItem('access_toke', token); // compatibility key
  } else {
    localStorage.removeItem('access_token');
    localStorage.removeItem('access_toke');
  }
};

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized access or session expired');
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    if (response.data.access_token) {
      setAuthToken(response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user || response.data));
    }
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    if (response.data.access_token) {
      setAuthToken(response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user || response.data));
    }
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
  logout: () => {
    setAuthToken(null);
    localStorage.removeItem('user');
  },
};

// Movie API
export const movieAPI = {
  getAll: async (params) => {
    const response = await api.get('/api/movies', { params });
    return response.data;
  },
  getByGenre: async (genre) => {
    const response = await api.get(`/api/movies/fetchGenre/${genre}`);
    return response.data;
  },
  getByName: async (name) => {
    const response = await api.get(`/api/movies/fetchMovieName/${name}`);
    return response.data;
  },
  getByLanguage: async (language) => {
    const response = await api.get(`/api/movies/fetchMovieBylanguage/${language}`);
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/api/movies/${id}`);
    return response.data;
  },
  addMovie: async (movieData) => {
    const response = await api.post('/api/movies/addMovie', movieData);
    return response.data;
  },
};

// Wishlist API
export const wishlistAPI = {
  getWishlist: async () => {
    const response = await api.get('/api/wishlist/ListMoviesinWishlist');
    return response.data;
  },
  add: async (movieId) => {
    const response = await api.post(`/api/wishlist/AddtoWishList/${movieId}`);
    return response.data;
  },
  remove: async (id) => {
    const response = await api.delete(`/api/wishlist/${id}`);
    return response.data;
  },
};

// Theater API
export const theaterAPI = {
  getAll: async (city) => {
    const response = await api.get('/api/theaters', { params: { city } });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/api/theaters/${id}`);
    return response.data;
  },
};

// Show API
export const showAPI = {
  getShows: async (params) => {
    const response = await api.get('/api/shows', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/api/shows/${id}`);
    return response.data;
  },
};

// Booking API
export const bookingAPI = {
  create: async (bookingData) => {
    const response = await api.post('/api/bookings', bookingData);
    return response.data;
  },
  getMyBookings: async () => {
    const response = await api.get('/api/bookings/my');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/api/bookings/${id}`);
    return response.data;
  },
  cancel: async (id) => {
    const response = await api.put(`/api/bookings/${id}/cancel`);
    return response.data;
  },
};

export default api;

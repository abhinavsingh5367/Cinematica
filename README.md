# 🎬 Cinematica - MERN Stack Movie Streaming & Ticket Booking Platform

**Cinematica** is a modern full-stack entertainment application built with the **MERN Stack** (MongoDB, Express.js, React, Node.js). It provides a personalized movie discovery and streaming experience alongside a real-time cinema theater seat booking and e-ticket generation workflow.

---

## 🚀 Key Features

- **Personalized Movie Catalog**: Filter movies by genre (Action, Thriller, Comedy, Drama, Sci-Fi) and language (English, Hindi, Marathi, Tamil, Telugu, Kannada).
- **Streaming & Watchlist**: High-definition video player with play, pause, resume controls, and one-click "Add to Watchlist" capability.
- **Interactive Seat & Theater Booking**: Select cinema theaters, screening dates, showtimes, and choose seats on an interactive cinema seat map with real-time pricing.
- **E-Ticket Pass Generation**: Instant digital ticket confirmation with booking reference codes and barcode pass display.
- **Secure JWT Authentication**: Role-based access control (User, Admin) with token persistence, bcrypt password hashing, and protected routes.
- **Admin Movie Management**: Dedicated dashboard form for publishing new titles with poster and streaming video URLs.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, React Router v6, React-Bootstrap, Axios, Video Player |
| **Backend** | Node.js, Express.js, RESTful API |
| **Database** | MongoDB & Mongoose ORM |
| **Authentication** | JWT (`jsonwebtoken`), Password Hashing (`bcryptjs`) |
| **Containerization** | Docker, Docker Compose |

---

## 📁 Repository Structure

```
Cinematica/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection and database seeding
│   │   ├── controllers/     # Auth, Movie, Wishlist, Theater, Show, Booking controllers
│   │   ├── middlewares/     # JWT authentication & authorization middleware
│   │   ├── models/          # Mongoose Schemas (User, Movie, Theater, Show, Booking, Wishlist)
│   │   └── routes/          # Express route definitions
│   ├── .env.example         # Backend environment variable template
│   ├── Dockerfile           # Backend container definition
│   ├── package.json         # Node.js backend dependencies
│   └── server.js            # Express server entry point
├── frontend/
│   ├── public/              # Static HTML & icons
│   ├── src/
│   │   ├── components/      # UI components (Home, Movie, SeatBooking, TicketConfirmation, etc.)
│   │   ├── context/         # React Context (Language Context)
│   │   ├── services/        # Centralized Axios API client (api.js)
│   │   ├── App.js           # Main application routing
│   │   └── index.js         # React root renderer
│   ├── .env.example         # Frontend environment variable template
│   ├── Dockerfile           # Frontend container definition
│   └── package.json         # React dependencies and proxy config
├── docker-compose.yml       # Multi-container orchestration (MongoDB + Express + React)
├── .gitignore
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js (v18+)](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas URI)
- [Git](https://git-scm.com/)

---

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run start
```
*The backend server will run on `http://localhost:5000`.*

#### Environment Variables (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/cinematica
JWT_SECRET=cinematica_jwt_secret_key_super_secure_2026
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

---

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm start
```
*The React app will open on `http://localhost:3000`.*

---

### 3. Running with Docker Compose

```bash
docker-compose up --build
```

---

## 📡 API Endpoints

### 🔐 Authentication (`/api/v1/auth` & `/api/auth`)
- `POST /register` - Register a new user
- `POST /authenticate` (or `/login`) - Login and receive JWT access token
- `GET /me` - Get logged-in user profile
- `POST /refresh-token` - Refresh JWT token

### 🎬 Movies (`/api/v1/movies` & `/api/movies`)
- `GET /` - List all movies (supports `genre`, `language`, `search`, `trending` queries)
- `GET /fetchGenre/:genre` - Filter movies by genre
- `GET /fetchMovieName/:moviename` - Search movie by title
- `GET /fetchMovieBylanguage/:language` - Filter movies by language
- `GET /:id` - Get movie details by ID
- `POST /addMovie` - Add new movie to catalog (Admin)

### ⭐ Wishlist (`/api/v1/wishlist` & `/api/wishlist`)
- `GET /ListMoviesinWishlist` - Get user's saved wishlist movies
- `POST /AddtoWishList/:Mid` - Add movie to user wishlist
- `POST /RemovefromWishList/:Mid` - Remove movie from wishlist

### 🎟️ Theaters, Shows & Bookings (`/api/bookings`, `/api/theaters`, `/api/shows`)
- `GET /api/theaters` - List cinema theaters
- `GET /api/shows` - Get show timings for a movie
- `POST /api/bookings` - Reserve seats and generate booking ticket
- `GET /api/bookings/my` - View current user's booking history
- `GET /api/bookings/:id` - Get e-ticket confirmation details

---

## 👨‍💻 Author

- **Abhinav Singh** - [@abhinavsingh5367](https://github.com/abhinavsingh5367)

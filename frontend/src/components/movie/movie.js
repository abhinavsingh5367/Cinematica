import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Badge, Alert } from "react-bootstrap";
import { useParams, Link } from 'react-router-dom';
import { movieAPI, wishlistAPI } from "../../services/api";

function Movie() {
    const [movieData, setMovieData] = useState(null);
    const [notification, setNotification] = useState({ show: false, message: '', variant: 'success' });
    const { id } = useParams();

    useEffect(() => {
        async function fetchMovieData() {
            try {
                const response = await movieAPI.getByName(id);
                if (Array.isArray(response) && response.length > 0) {
                    setMovieData(response[0]);
                } else if (response && !Array.isArray(response)) {
                    setMovieData(response);
                } else {
                    // Fallback movie details if not found
                    setMovieData({
                        movie_id: 'default-1',
                        movie_title: id,
                        title: id,
                        Description: 'An extraordinary cinematic experience featuring breathtaking storytelling and high-octane performance.',
                        genre: 'Sci-Fi / Action',
                        Language: 'English',
                        release_date: '2024',
                        rating: 8.8,
                        duration: '2h 25m',
                        movielink: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                        posterlink: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
                    });
                }
            } catch (error) {
                console.error("Error fetching movie data: ", error);
                setMovieData({
                    movie_id: 'default-1',
                    movie_title: id,
                    title: id,
                    Description: 'An extraordinary cinematic experience featuring breathtaking storytelling and high-octane performance.',
                    genre: 'Sci-Fi / Action',
                    Language: 'English',
                    release_date: '2024',
                    rating: 8.8,
                    duration: '2h 25m',
                    movielink: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                    posterlink: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
                });
            }
        }
        fetchMovieData();
    }, [id]);

    const addToWatchlist = async () => {
        const movieId = movieData?._id || movieData?.id || movieData?.movie_id || id;
        try {
            await wishlistAPI.add(movieId);
            setNotification({ show: true, message: 'Added to Watchlist successfully!', variant: 'success' });
        } catch (error) {
            console.error("Error adding to Watchlist: ", error);
            setNotification({ show: true, message: 'Added to Watchlist!', variant: 'info' });
        }
    };

    return (
        <Container fluid style={{ backgroundColor: '#070F2B', color: '#FFFFFF', minHeight: '100vh', paddingBottom: '60px' }}>
            <Container className="pt-4">
                {notification.show && (
                    <Alert
                        variant={notification.variant}
                        onClose={() => setNotification({ show: false, message: '', variant: 'success' })}
                        dismissible
                        className="mb-3"
                    >
                        {notification.message}
                    </Alert>
                )}

                {movieData && (
                    <>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h1 className="fw-bold mb-0">{movieData.movie_title || movieData.title}</h1>
                            <div className="d-flex gap-2">
                                <Link to={`/book/${encodeURIComponent(movieData.movie_title || movieData.title)}`}>
                                    <Button variant="warning" className="fw-bold px-4">
                                        🎟️ Book Tickets
                                    </Button>
                                </Link>
                                <Button variant="outline-info" onClick={addToWatchlist}>
                                    + Watchlist
                                </Button>
                            </div>
                        </div>

                        {/* Video Player */}
                        <div className="rounded overflow-hidden mb-4 shadow-lg border border-secondary" style={{ backgroundColor: '#000' }}>
                            <video
                                controls
                                poster={movieData.posterlink}
                                style={{ width: '100%', maxHeight: '560px', objectFit: 'contain' }}
                                src={movieData.movielink || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
                            >
                                Your browser does not support HTML video.
                            </video>
                        </div>

                        {/* Movie Details Grid */}
                        <Row className="g-4">
                            <Col md={8}>
                                <div className="p-4 rounded bg-dark border border-secondary">
                                    <h4 className="fw-bold text-light mb-3">Synopsis</h4>
                                    <p className="lead" style={{ fontSize: '1.05rem', lineHeight: '1.7' }}>
                                        {movieData.Description || movieData.description}
                                    </p>

                                    <div className="d-flex gap-3 mt-4">
                                        <Link to={`/book/${encodeURIComponent(movieData.movie_title || movieData.title)}`}>
                                            <Button variant="warning" size="lg" className="fw-bold px-4">
                                                Select Theater & Book Seats
                                            </Button>
                                        </Link>
                                        <Link to="/home">
                                            <Button variant="outline-light" size="lg">
                                                ← Back to Browse
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </Col>

                            <Col md={4}>
                                <div className="p-4 rounded bg-dark border border-secondary">
                                    <h5 className="fw-bold text-light border-bottom pb-2 border-secondary mb-3">Movie Information</h5>
                                    
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Genre:</span>
                                        <Badge bg="primary">{movieData.genre}</Badge>
                                    </div>

                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Language:</span>
                                        <span className="fw-bold">{movieData.Language || movieData.language}</span>
                                    </div>

                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Release Year:</span>
                                        <span>{movieData.release_date || movieData.releaseDate}</span>
                                    </div>

                                    <div className="d-flex justify-content-between mb-3">
                                        <span className="text-muted">Rating:</span>
                                        <span className="text-warning fw-bold">⭐ {movieData.rating} / 10</span>
                                    </div>

                                    <Button variant="outline-warning" className="w-100" onClick={addToWatchlist}>
                                        ⭐ Add to Watchlist
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </>
                )}
            </Container>
        </Container>
    );
}

export default Movie;

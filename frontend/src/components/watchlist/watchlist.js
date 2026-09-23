import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { wishlistAPI } from '../../services/api';

function Watchlist() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchWatchlistMovies() {
            try {
                const data = await wishlistAPI.getWishlist();
                setMovies(data || []);
            } catch (error) {
                console.error('Error fetching watchlist movies:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchWatchlistMovies();
    }, []);

    const removeFromWatchlist = async (id) => {
        try {
            await wishlistAPI.remove(id);
            setMovies(movies.filter((movie) => movie.id !== id && movie._id !== id));
        } catch (error) {
            console.error('Error removing movie from watchlist:', error);
            // Local optimistic remove
            setMovies(movies.filter((movie) => movie.id !== id && movie._id !== id));
        }
    };

    return (
        <div style={{ backgroundColor: '#070F2B', minHeight: '100vh', color: '#FFFFFF', padding: '40px 0' }}>
            <Container>
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3 border-secondary">
                    <div>
                        <h2 className="fw-bold mb-1">My Watchlist</h2>
                        <p className="text-muted mb-0">Your saved movies for instant streaming and booking</p>
                    </div>
                    <Link to="/home">
                        <Button variant="outline-light" size="sm">Explore More</Button>
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : movies.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                        <h4>Your watchlist is empty</h4>
                        <p>Browse movies and click "Add to Watchlist" to save them here.</p>
                        <Link to="/home">
                            <Button variant="primary" className="mt-2">Browse Movies</Button>
                        </Link>
                    </div>
                ) : (
                    <Row className="g-4">
                        {movies.map((movie) => (
                            <Col key={movie.id || movie._id} xs={12} sm={6} md={4} lg={3}>
                                <Card className="bg-dark text-white border-secondary h-100 shadow-sm overflow-hidden">
                                    <div style={{ height: '320px', overflow: 'hidden' }}>
                                        <Card.Img
                                            variant="top"
                                            src={movie.posterlink}
                                            alt={movie.movie_title || movie.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <Card.Body className="d-flex flex-column justify-content-between">
                                        <div>
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <Badge bg="secondary">{movie.genre || 'Movie'}</Badge>
                                                <span className="small text-warning">⭐ {movie.rating || 8.5}</span>
                                            </div>
                                            <Card.Title className="fw-bold fs-6 text-truncate mb-2">
                                                {movie.movie_title || movie.title}
                                            </Card.Title>
                                        </div>
                                        <div className="d-flex flex-column gap-2 mt-2">
                                            <div className="d-flex gap-2">
                                                <Link to={"/movie/" + encodeURIComponent(movie.movie_title || movie.title)} className="flex-grow-1">
                                                    <Button variant="primary" size="sm" className="w-100">
                                                        ▶ Stream
                                                    </Button>
                                                </Link>
                                                <Link to={"/book/" + encodeURIComponent(movie.movie_title || movie.title)} className="flex-grow-1">
                                                    <Button variant="warning" size="sm" className="w-100 fw-bold">
                                                        🎟️ Book
                                                    </Button>
                                                </Link>
                                            </div>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => removeFromWatchlist(movie.id || movie._id)}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </div>
    );
}

export default Watchlist;

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';
import { movieAPI } from '../../services/api';

function MovieByLanguage() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const { language } = useLanguage();

    useEffect(() => {
        async function fetchMoviesByLanguage() {
            try {
                setLoading(true);
                const data = await movieAPI.getByLanguage(language);
                setMovies(data || []);
            } catch (error) {
                console.error('Error fetching movies by language:', error);
                setMovies([]);
            } finally {
                setLoading(false);
            }
        }
        fetchMoviesByLanguage();
    }, [language]);

    return (
        <div style={{ backgroundColor: '#070F2B', minHeight: '100vh', color: '#FFFFFF', padding: '40px 0' }}>
            <Container>
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3 border-secondary">
                    <div>
                        <h2 className="fw-bold mb-1">Movies in {language}</h2>
                        <p className="text-muted mb-0">Discover popular titles available in {language}</p>
                    </div>
                    <Link to="/home">
                        <Button variant="outline-light" size="sm">Browse All</Button>
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : movies.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                        <h4>No movies found in {language}</h4>
                        <p>Try switching to another language or check back soon!</p>
                    </div>
                ) : (
                    <Row className="g-4">
                        {movies.map((movie) => {
                            const title = movie.movie_title || movie.title;
                            return (
                                <Col key={movie.id || movie._id} xs={12} sm={6} md={4} lg={3}>
                                    <Card className="bg-dark text-white border-secondary h-100 shadow-sm overflow-hidden">
                                        <div style={{ height: '300px', overflow: 'hidden' }}>
                                            <Card.Img
                                                variant="top"
                                                src={movie.posterlink}
                                                alt={title}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>
                                        <Card.Body className="d-flex flex-column justify-content-between">
                                            <Card.Title className="fw-bold fs-6 text-truncate mb-3">{title}</Card.Title>
                                            <div className="d-flex gap-2">
                                                <Link to={"/movie/" + encodeURIComponent(title)} className="flex-fill">
                                                    <Button variant="primary" size="sm" className="w-100">
                                                        ▶ Watch
                                                    </Button>
                                                </Link>
                                                <Link to={"/book/" + encodeURIComponent(title)} className="flex-fill">
                                                    <Button variant="warning" size="sm" className="w-100 fw-bold">
                                                        🎟️ Book
                                                    </Button>
                                                </Link>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                )}
            </Container>
        </div>
    );
}

export default MovieByLanguage;

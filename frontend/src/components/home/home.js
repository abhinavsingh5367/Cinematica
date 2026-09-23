import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Carousel, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { movieAPI } from '../../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import bannerImage from '../../images/movie_banner_1.jpg';

const defaultMovies = {
    action: [
        { id: 'a1', movie_title: 'The Dark Knight', title: 'The Dark Knight', posterlink: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80', rating: 9.0, genre: 'Action' },
        { id: 'a2', movie_title: 'Kantara', title: 'Kantara', posterlink: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=80', rating: 8.4, genre: 'Action' },
    ],
    thriller: [
        { id: 't1', movie_title: 'Inception', title: 'Inception', posterlink: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80', rating: 8.8, genre: 'Thriller' },
    ],
    comedy: [
        { id: 'c1', movie_title: 'The Grand Budapest Hotel', title: 'The Grand Budapest Hotel', posterlink: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80', rating: 8.1, genre: 'Comedy' },
    ],
    drama: [
        { id: 'd1', movie_title: 'Oppenheimer', title: 'Oppenheimer', posterlink: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&auto=format&fit=crop&q=80', rating: 8.9, genre: 'Drama' },
        { id: 'd2', movie_title: 'Dangal', title: 'Dangal', posterlink: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80', rating: 8.8, genre: 'Drama' },
    ],
    scienceFiction: [
        { id: 's1', movie_title: 'Interstellar', title: 'Interstellar', posterlink: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80', rating: 8.7, genre: 'Science Fiction' },
    ],
};

const Home = () => {
    const [index, setIndex] = useState(0);
    const [actionMovies, setActionMovies] = useState(defaultMovies.action);
    const [thrillerMovies, setThrillerMovies] = useState(defaultMovies.thriller);
    const [comedyMovies, setComedyMovies] = useState(defaultMovies.comedy);
    const [dramaMovies, setDramaMovies] = useState(defaultMovies.drama);
    const [scienceFictionMovies, setScienceFictionMovies] = useState(defaultMovies.scienceFiction);

    useEffect(() => {
        async function fetchAllGenres() {
            try {
                const [act, thr, com, drm, sci] = await Promise.allSettled([
                    movieAPI.getByGenre('action'),
                    movieAPI.getByGenre('thriller'),
                    movieAPI.getByGenre('comedy'),
                    movieAPI.getByGenre('drama'),
                    movieAPI.getByGenre('scienceFiction'),
                ]);

                if (act.status === 'fulfilled' && act.value && act.value.length > 0) setActionMovies(act.value);
                if (thr.status === 'fulfilled' && thr.value && thr.value.length > 0) setThrillerMovies(thr.value);
                if (com.status === 'fulfilled' && com.value && com.value.length > 0) setComedyMovies(com.value);
                if (drm.status === 'fulfilled' && drm.value && drm.value.length > 0) setDramaMovies(drm.value);
                if (sci.status === 'fulfilled' && sci.value && sci.value.length > 0) setScienceFictionMovies(sci.value);
            } catch (error) {
                console.warn('Using default catalog for home display:', error);
            }
        }

        fetchAllGenres();
    }, []);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    const renderMovieSection = (title, movies, sectionId) => (
        <div className="mb-5" id={sectionId}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="fw-bold mb-0 text-light border-start border-4 border-primary ps-3">{title}</h3>
                <span className="text-muted small">{movies.length} titles available</span>
            </div>
            <Row className="g-3">
                {movies.map((movie, idx) => {
                    const movieTitle = movie.movie_title || movie.title || 'Movie';
                    return (
                        <Col key={movie.id || movie._id || idx} xs={6} sm={4} md={3} lg={2}>
                            <Card className="bg-dark text-white border-secondary h-100 shadow-sm overflow-hidden movie-card" style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}>
                                <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                                    <Card.Img
                                        variant="top"
                                        src={movie.posterlink}
                                        alt={movieTitle}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    {movie.rating && (
                                        <Badge bg="warning" text="dark" className="position-absolute top-0 end-0 m-2 fw-bold">
                                            ★ {movie.rating}
                                        </Badge>
                                    )}
                                </div>
                                <Card.Body className="p-2 d-flex flex-column justify-content-between">
                                    <Card.Title className="text-truncate fs-6 fw-bold mb-2" title={movieTitle}>
                                        {movieTitle}
                                    </Card.Title>
                                    <div className="d-flex gap-1">
                                        <Link to={"/movie/" + encodeURIComponent(movieTitle)} className="flex-fill">
                                            <Button size="sm" variant="outline-light" className="w-100" style={{ fontSize: '11px' }}>
                                                ▶ Watch
                                            </Button>
                                        </Link>
                                        <Link to={"/book/" + encodeURIComponent(movieTitle)} className="flex-fill">
                                            <Button size="sm" variant="warning" className="w-100 fw-bold" style={{ fontSize: '11px' }}>
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
        </div>
    );

    return (
        <Container fluid style={{ backgroundColor: '#070F2B', color: '#FFFFFF', minHeight: '100vh', paddingBottom: '60px' }}>
            {/* Hero Carousel */}
            <Row className="mb-4">
                <Col className="px-0">
                    <Carousel activeIndex={index} onSelect={handleSelect}>
                        <Carousel.Item style={{ maxHeight: '65vh' }}>
                            <img
                                className="d-block w-100"
                                src={bannerImage}
                                alt="Cinematica Feature"
                                style={{ height: '65vh', objectFit: 'cover', filter: 'brightness(0.7)' }}
                            />
                            <Carousel.Caption className="text-start" style={{ bottom: '15%' }}>
                                <Badge bg="primary" className="mb-2">STREAMING NOW & IN THEATERS</Badge>
                                <h1 className="display-4 fw-bold">Experience the Ultimate Cinema</h1>
                                <p className="lead d-none d-md-block">Stream 4K Ultra-HD movies or reserve your cinema seats with a single tap.</p>
                                <div className="d-flex gap-3">
                                    <Link to="/book/The%20Dark%20Knight">
                                        <Button variant="warning" size="lg" className="fw-bold px-4">🎟️ Book Tickets</Button>
                                    </Link>
                                    <Link to="/movie/The%20Dark%20Knight">
                                        <Button variant="outline-light" size="lg" className="px-4">▶ Watch Trailer</Button>
                                    </Link>
                                </div>
                            </Carousel.Caption>
                        </Carousel.Item>
                    </Carousel>
                </Col>
            </Row>

            {/* Category Rows */}
            <Container>
                {renderMovieSection('Action Blockbusters', actionMovies, 'Action')}
                {renderMovieSection('Thrilling Suspense', thrillerMovies, 'Thriller')}
                {renderMovieSection('Sci-Fi & Fantasy', scienceFictionMovies, 'ScienceFiction')}
                {renderMovieSection('Award-Winning Drama', dramaMovies, 'Drama')}
                {renderMovieSection('Comedy & Fun', comedyMovies, 'Comedy')}
            </Container>
        </Container>
    );
};

export default Home;

import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { movieAPI } from '../../services/api';

function AddMovie() {
    const navigate = useNavigate();
    const [movieData, setMovieData] = useState({
        title: '',
        description: '',
        rating: 8.5,
        genre: 'Action',
        language: 'English',
        duration: '2h 15m',
        releaseDate: '2024',
        moviefilename: '',
        posterfilename: '',
        trending: true
    });

    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setMovieData({
            ...movieData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await movieAPI.addMovie(movieData);
            setStatus({ type: 'success', message: 'Movie added successfully to Cinematica library!' });
            setTimeout(() => {
                navigate('/home');
            }, 1500);
        } catch (error) {
            console.error('Error adding movie:', error);
            setStatus({
                type: 'danger',
                message: error.response?.data?.message || 'Failed to add movie. Please check required fields.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#070F2B', minHeight: '100vh', color: '#FFFFFF', padding: '40px 0' }}>
            <Container style={{ maxWidth: '800px' }}>
                <Card className="bg-dark text-white border-secondary shadow-lg p-4">
                    <h2 className="fw-bold mb-1 border-bottom pb-2 border-secondary">Add New Movie</h2>
                    <p className="text-muted mb-4">Add a new film to the streaming and cinema booking platform</p>

                    {status.message && (
                        <Alert variant={status.type} dismissible onClose={() => setStatus({ type: '', message: '' })}>
                            {status.message}
                        </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                        <Row className="g-3">
                            <Col md={12}>
                                <Form.Group controlId="title">
                                    <Form.Label className="fw-semibold">Movie Title *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g. Avatar: The Way of Water"
                                        name="title"
                                        value={movieData.title}
                                        onChange={handleChange}
                                        required
                                        className="bg-secondary text-white border-0"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group controlId="description">
                                    <Form.Label className="fw-semibold">Description *</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Enter movie plot synopsis..."
                                        name="description"
                                        value={movieData.description}
                                        onChange={handleChange}
                                        required
                                        className="bg-secondary text-white border-0"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group controlId="genre">
                                    <Form.Label className="fw-semibold">Genre *</Form.Label>
                                    <Form.Select
                                        name="genre"
                                        value={movieData.genre}
                                        onChange={handleChange}
                                        className="bg-secondary text-white border-0"
                                    >
                                        <option value="Action">Action</option>
                                        <option value="Thriller">Thriller</option>
                                        <option value="Comedy">Comedy</option>
                                        <option value="Drama">Drama</option>
                                        <option value="Science Fiction">Science Fiction</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group controlId="language">
                                    <Form.Label className="fw-semibold">Language *</Form.Label>
                                    <Form.Select
                                        name="language"
                                        value={movieData.language}
                                        onChange={handleChange}
                                        className="bg-secondary text-white border-0"
                                    >
                                        <option value="English">English</option>
                                        <option value="Hindi">Hindi</option>
                                        <option value="Marathi">Marathi</option>
                                        <option value="Tamil">Tamil</option>
                                        <option value="Telugu">Telugu</option>
                                        <option value="Kannada">Kannada</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group controlId="rating">
                                    <Form.Label className="fw-semibold">Rating (1-10)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.1"
                                        min="1"
                                        max="10"
                                        name="rating"
                                        value={movieData.rating}
                                        onChange={handleChange}
                                        className="bg-secondary text-white border-0"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group controlId="duration">
                                    <Form.Label className="fw-semibold">Duration</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g. 2h 24m"
                                        name="duration"
                                        value={movieData.duration}
                                        onChange={handleChange}
                                        className="bg-secondary text-white border-0"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group controlId="releaseDate">
                                    <Form.Label className="fw-semibold">Release Year</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g. 2024"
                                        name="releaseDate"
                                        value={movieData.releaseDate}
                                        onChange={handleChange}
                                        className="bg-secondary text-white border-0"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group controlId="posterfilename">
                                    <Form.Label className="fw-semibold">Poster Image URL</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="https://example.com/poster.jpg"
                                        name="posterfilename"
                                        value={movieData.posterfilename}
                                        onChange={handleChange}
                                        className="bg-secondary text-white border-0"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group controlId="moviefilename">
                                    <Form.Label className="fw-semibold">Video Streaming URL (.mp4 / HLS)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="https://example.com/video.mp4"
                                        name="moviefilename"
                                        value={movieData.moviefilename}
                                        onChange={handleChange}
                                        className="bg-secondary text-white border-0"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Check
                                    type="checkbox"
                                    id="trendingCheckbox"
                                    label="Feature in Trending Carousel"
                                    name="trending"
                                    checked={movieData.trending}
                                    onChange={handleChange}
                                    className="mt-2"
                                />
                            </Col>

                            <Col md={12} className="mt-4">
                                <Button variant="warning" type="submit" size="lg" className="w-100 fw-bold" disabled={loading}>
                                    {loading ? 'Publishing Movie...' : 'Save & Publish Movie'}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </Container>
        </div>
    );
}

export default AddMovie;

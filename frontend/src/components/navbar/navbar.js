import React, { useState, useEffect } from 'react';
import { Button, Container, Form, Nav, Navbar, NavDropdown, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLanguage } from '../../context/LanguageContext';
import { authAPI, getAuthToken } from '../../services/api';

function CustomeNavbar() {
    const { changeLanguage } = useLanguage();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                setUser(null);
            }
        }
    }, []);

    const handleLanguageChange = (selectedLanguage) => {
        changeLanguage(selectedLanguage);
        navigate('/moviebylanguage');
    };

    const handleLogout = () => {
        authAPI.logout();
        setUser(null);
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/movie/${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    const isLoggedIn = !!getAuthToken();

    return (
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="border-bottom border-secondary shadow-sm py-2">
            <Container fluid className="px-4">
                <Navbar.Brand as={Link} to="/home" className="fw-bold fs-3 text-warning tracking-wider" style={{ letterSpacing: '2px' }}>
                    CINEMATICA
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav className="me-auto my-2 my-lg-0 align-items-center">
                        <Nav.Link as={Link} to="/home" className="px-3">Home</Nav.Link>
                        <Nav.Link as={Link} to="/watchlist" className="px-3">Watchlist</Nav.Link>
                        <Nav.Link as={Link} to="/bookings" className="px-3">My Tickets</Nav.Link>

                        <NavDropdown title="Genres" id="genreDropdown" className="px-2">
                            <NavDropdown.Item href="#Action">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#Thriller">Thriller</NavDropdown.Item>
                            <NavDropdown.Item href="#ScienceFiction">Science Fiction</NavDropdown.Item>
                            <NavDropdown.Item href="#Drama">Drama</NavDropdown.Item>
                            <NavDropdown.Item href="#Comedy">Comedy</NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown title="Languages" id="langDropdown" className="px-2">
                            <NavDropdown.Item onClick={() => handleLanguageChange("English")}>English</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleLanguageChange("Hindi")}>Hindi</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleLanguageChange("Marathi")}>Marathi</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleLanguageChange("Tamil")}>Tamil</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleLanguageChange("Telagu")}>Telugu</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleLanguageChange("Kannada")}>Kannada</NavDropdown.Item>
                        </NavDropdown>

                        <Nav.Link as={Link} to="/admin" className="px-3 text-info">
                            + Add Movie
                        </Nav.Link>
                    </Nav>

                    {/* Search and Auth controls */}
                    <div className="d-flex align-items-center gap-2">
                        <Form onSubmit={handleSearch} className="d-flex">
                            <Form.Control
                                type="search"
                                placeholder="Search movies..."
                                className="me-2 bg-dark text-white border-secondary"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ minWidth: '180px' }}
                            />
                        </Form>

                        {isLoggedIn ? (
                            <div className="d-flex align-items-center gap-2 ms-2">
                                <Badge bg="secondary" className="px-2 py-2">
                                    👤 {user?.firstname || user?.first_name || 'Member'}
                                </Badge>
                                <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div className="d-flex gap-2 ms-2">
                                <Link to="/login">
                                    <Button variant="outline-light" size="sm">Sign In</Button>
                                </Link>
                                <Link to="/signup">
                                    <Button variant="warning" size="sm" className="fw-bold">Sign Up</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default CustomeNavbar;

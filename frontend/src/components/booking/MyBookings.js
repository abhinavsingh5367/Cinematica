import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { bookingAPI } from '../../services/api';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBookings() {
      try {
        const data = await bookingAPI.getMyBookings();
        setBookings(data || []);
      } catch (err) {
        console.warn('Could not load bookings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, []);

  return (
    <div style={{ backgroundColor: '#070F2B', minHeight: '100vh', color: '#FFFFFF', padding: '40px 0' }}>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3 border-secondary">
          <div>
            <h2 className="fw-bold mb-1">My Movie Tickets</h2>
            <p className="text-muted mb-0">View all your confirmed cinema reservations</p>
          </div>
          <Link to="/home">
            <Button variant="outline-primary" size="sm">Browse Movies</Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <h4>No Booked Tickets Yet</h4>
            <p>Pick a movie, select your seats, and your e-tickets will appear here!</p>
            <Link to="/home">
              <Button variant="primary" className="mt-2">Explore Movies Now</Button>
            </Link>
          </div>
        ) : (
          <Row className="g-4">
            {bookings.map((b) => (
              <Col key={b._id} md={6}>
                <Card className="bg-dark text-white border-secondary shadow-sm h-100">
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="small text-info fw-bold">{b.bookingReference || b._id}</span>
                        <Badge bg={b.bookingStatus === 'CONFIRMED' ? 'success' : 'secondary'}>
                          {b.bookingStatus}
                        </Badge>
                      </div>
                      <h4 className="fw-bold mb-1">{b.movie?.title || b.movie?.movie_title || 'Cinematica Movie'}</h4>
                      <p className="text-muted small mb-2">{b.theater?.name || 'Cinematica Multiplex'}</p>
                      <div className="small mb-3">
                        <span className="text-muted">Seats: </span>
                        <span className="fw-bold text-warning">{b.seats?.join(', ')}</span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center border-top pt-2 border-secondary">
                      <span className="fw-bold text-light">${b.totalAmount?.toFixed(2)}</span>
                      <Link to={`/ticket/${b._id}`} state={{ booking: b, movie: b.movie, theater: b.theater }}>
                        <Button size="sm" variant="outline-info">View Pass</Button>
                      </Link>
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

export default MyBookings;

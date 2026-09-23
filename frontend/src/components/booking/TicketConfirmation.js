import React from 'react';
import { Container, Card, Row, Col, Button, Badge } from 'react-bootstrap';
import { useLocation, useParams, useNavigate, Link } from 'react-router-dom';

function TicketConfirmation() {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state || {};
  const movie = state.movie || {};
  const theater = state.theater || {};
  const seats = state.selectedSeats || (state.booking && state.booking.seats) || ['A1', 'A2'];
  const totalAmount = state.totalAmount || (state.booking && state.booking.totalAmount) || 29.0;
  const showTime = state.time || '06:30 PM';
  const showDate = state.date || new Date().toISOString().split('T')[0];
  const refCode = (state.booking && (state.booking.bookingReference || state.booking._id)) || bookingId || 'CNM-78421';

  return (
    <div style={{ backgroundColor: '#070F2B', minHeight: '100vh', color: '#FFFFFF', padding: '40px 0' }}>
      <Container style={{ maxWidth: '680px' }}>
        {/* Success Header */}
        <div className="text-center mb-4">
          <div
            style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#198754',
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              color: '#FFF',
              boxShadow: '0 0 20px rgba(25, 135, 84, 0.6)',
              marginBottom: '16px',
            }}
          >
            ✓
          </div>
          <h2 className="fw-bold">Booking Confirmed!</h2>
          <p className="text-muted">Your tickets have been reserved and payment was completed.</p>
        </div>

        {/* Boarding Pass / Ticket Card */}
        <Card className="bg-dark text-white border-0 shadow-lg overflow-hidden" style={{ borderRadius: '16px' }}>
          {/* Ticket Header */}
          <div className="p-4" style={{ background: 'linear-gradient(135deg, #1b2856, #0f172a)' }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-uppercase tracking-widest small fw-bold text-info">CINEMATICA E-TICKET PASS</span>
              <Badge bg="success">CONFIRMED</Badge>
            </div>
            <h3 className="fw-bold mb-1">{movie.title || movie.movie_title || 'Cinematica Movie'}</h3>
            <span className="text-muted small">{movie.genre || 'Action / Drama'} • {theater.name || 'Cinematica IMAX Cinema'}</span>
          </div>

          {/* Ticket Body */}
          <Card.Body className="p-4 bg-dark">
            <Row className="g-3 mb-4">
              <Col xs={6} sm={3}>
                <span className="text-muted small d-block">DATE</span>
                <span className="fw-bold">{showDate}</span>
              </Col>
              <Col xs={6} sm={3}>
                <span className="text-muted small d-block">TIME</span>
                <span className="fw-bold text-info">{showTime}</span>
              </Col>
              <Col xs={6} sm={3}>
                <span className="text-muted small d-block">SEATS</span>
                <span className="fw-bold text-warning">{Array.isArray(seats) ? seats.join(', ') : seats}</span>
              </Col>
              <Col xs={6} sm={3}>
                <span className="text-muted small d-block">AMOUNT</span>
                <span className="fw-bold">${Number(totalAmount).toFixed(2)}</span>
              </Col>
            </Row>

            {/* Perforated Line Visual */}
            <div
              style={{
                borderBottom: '2px dashed #4b5563',
                margin: '20px -24px',
              }}
            />

            {/* Ticket Footer / Barcode */}
            <Row className="align-items-center pt-2">
              <Col xs={12} sm={8}>
                <span className="text-muted small d-block">BOOKING REFERENCE</span>
                <span className="h5 fw-bold font-monospace text-light">{refCode}</span>
                <p className="text-muted small mb-0 mt-1">Present this e-ticket on your phone at cinema entrance.</p>
              </Col>
              <Col xs={12} sm={4} className="text-sm-end text-center mt-3 mt-sm-0">
                {/* Simulated Barcode */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    display: 'inline-block',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    color: '#000',
                    letterSpacing: '4px',
                  }}
                >
                  ||| | |||| | ||| || |||
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Action Buttons */}
        <div className="d-flex justify-content-center gap-3 mt-4">
          <Button variant="outline-light" onClick={() => window.print()}>
            🖨️ Print Ticket
          </Button>
          <Link to="/home">
            <Button variant="primary">
              🎬 Back to Home
            </Button>
          </Link>
          <Link to="/watchlist">
            <Button variant="outline-info">
              ⭐ My Watchlist
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}

export default TicketConfirmation;

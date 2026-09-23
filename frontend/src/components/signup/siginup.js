import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api";
import "./signup.css";
import Logo from "../../images/Disney+_Hotstar_logo.svg.png";

const Register = () => {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [show, setShow] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setShow(false);
        setErrorMsg("");

        try {
            await authAPI.register({
                firstname: firstName,
                lastname: lastName,
                email: email,
                password: password,
                role: "USER"
            });
            setLoading(false);
            navigate("/home");
        } catch (error) {
            console.error("Registration error:", error);
            setErrorMsg(
                error.response && error.response.data && error.response.data.message
                    ? error.response.data.message
                    : "Registration failed. Please check your details."
            );
            setShow(true);
            setLoading(false);
        }
    };

    return (
        <div
            className="sign-in__wrapper"
            style={{ backgroundColor: '#070F2B', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <div className="sign-in__backdrop"></div>
            <Form className="shadow-lg p-4 bg-white rounded" onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '440px', zIndex: 1 }}>
                <div className="text-center mb-3">
                    <img
                        className="img-fluid mx-auto d-block mb-2"
                        src={Logo}
                        alt="Cinematica Logo"
                        style={{ maxHeight: '60px' }}
                    />
                    <h3 className="fw-bold text-dark">Create Account</h3>
                    <p className="text-muted small">Join CINEMATICA for streaming and movie bookings</p>
                </div>

                {show && (
                    <Alert
                        className="mb-3"
                        variant="danger"
                        onClose={() => setShow(false)}
                        dismissible
                    >
                        {errorMsg}
                    </Alert>
                )}

                <div className="row g-2 mb-2">
                    <div className="col-md">
                        <Form.Group controlId="firstName">
                            <Form.Label className="fw-semibold small">First Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={firstName}
                                placeholder="John"
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </div>
                    <div className="col-md">
                        <Form.Group controlId="lastName">
                            <Form.Label className="fw-semibold small">Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={lastName}
                                placeholder="Doe"
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </div>
                </div>

                <Form.Group className="mb-2" controlId="email">
                    <Form.Label className="fw-semibold small">Email Address</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        placeholder="john.doe@example.com"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                    <Form.Label className="fw-semibold small">Password (Min 6 chars)</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        placeholder="••••••••"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                </Form.Group>

                <Button className="w-100 py-2 fw-semibold" variant="primary" type="submit" disabled={loading}>
                    {loading ? "Creating Account..." : "Register"}
                </Button>

                <div className="text-center mt-3 small">
                    <span className="text-muted">Already have an account? </span>
                    <Link to="/login" className="text-decoration-none fw-semibold">Sign in here</Link>
                </div>
            </Form>
        </div>
    );
};

export default Register;

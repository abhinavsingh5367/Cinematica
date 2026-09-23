import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../../services/api";
import "./login.css";
import Logo from "../../images/Disney+_Hotstar_logo.svg.png";

const Login = () => {
    const navigate = useNavigate();

    const [inputEmail, setInputEmail] = useState("");
    const [inputPassword, setInputPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setShow(false);
        setErrorMsg("");

        try {
            const data = await authAPI.login(inputEmail, inputPassword);
            console.log("Logged in successfully:", data);
            setLoading(false);
            navigate("/home");
        } catch (error) {
            console.error("Login error:", error);
            setErrorMsg(
                error.response && error.response.data && error.response.data.message
                    ? error.response.data.message
                    : "Incorrect email or password. Please try again."
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
            <Form className="shadow-lg p-4 bg-white rounded" onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '420px', zIndex: 1 }}>
                <div className="text-center mb-3">
                    <img
                        className="img-fluid mx-auto d-block mb-2"
                        src={Logo}
                        alt="Cinematica Logo"
                        style={{ maxHeight: '60px' }}
                    />
                    <h3 className="fw-bold text-dark">Welcome to CINEMATICA</h3>
                    <p className="text-muted small">Sign in to stream movies & book tickets</p>
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

                <Form.Group className="mb-3" controlId="email">
                    <Form.Label className="fw-semibold">Email Address</Form.Label>
                    <Form.Control
                        type="email"
                        value={inputEmail}
                        placeholder="name@example.com"
                        onChange={(e) => setInputEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                    <Form.Label className="fw-semibold">Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={inputPassword}
                        placeholder="••••••••"
                        onChange={(e) => setInputPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button className="w-100 py-2 fw-semibold" variant="primary" type="submit" disabled={loading}>
                    {loading ? "Signing In..." : "Sign In"}
                </Button>

                <div className="d-flex justify-content-between align-items-center mt-3 small">
                    <Link to="/signup" className="text-decoration-none">Create an account</Link>
                    <Link to="/home" className="text-muted text-decoration-none">Explore as Guest</Link>
                </div>
            </Form>
        </div>
    );
};

export default Login;

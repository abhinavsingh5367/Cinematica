const User = require('../models/User.model');
const jwt = require('jsonwebtoken');

// @desc    Register user
// @route   POST /api/v1/auth/register, POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { firstname, lastname, email, password, role } = req.body;

    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide firstname, lastname, email, and password',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists',
      });
    }

    // Create user
    const user = await User.create({
      firstname,
      lastname,
      email,
      password,
      role: role || 'USER',
    });

    // Generate JWT
    const accessToken = user.getSignedJwtToken();
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'cinematica_jwt_secret_key_super_secure_2026',
      { expiresIn: '30d' }
    );

    // Spring Boot AuthenticationResponse format + REST format
    return res.status(201).json({
      access_token: accessToken,
      refresh_token: refreshToken,
      first_name: user.firstname,
      last_name: user.lastname,
      id: user._id,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Register Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/v1/auth/authenticate, POST /api/auth/login
// @access  Public
const authenticate = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password',
      });
    }

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const accessToken = user.getSignedJwtToken();
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'cinematica_jwt_secret_key_super_secure_2026',
      { expiresIn: '30d' }
    );

    return res.status(200).json({
      access_token: accessToken,
      refresh_token: refreshToken,
      first_name: user.firstname,
      last_name: user.lastname,
      id: user._id,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Authenticate Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during authentication',
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me, GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Refresh access token
// @route   POST /api/v1/auth/refresh-token, POST /api/auth/refresh
// @access  Public
const refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) {
      return res.status(400).json({ success: false, message: 'Refresh token required' });
    }

    const decoded = jwt.verify(
      refresh_token,
      process.env.JWT_SECRET || 'cinematica_jwt_secret_key_super_secure_2026'
    );
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const newAccessToken = user.getSignedJwtToken();
    return res.status(200).json({
      access_token: newAccessToken,
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token refresh failed' });
  }
};

module.exports = {
  register,
  authenticate,
  getMe,
  refreshToken,
};

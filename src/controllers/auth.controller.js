const User = require('../models/User.model');
const { asyncHandler } = require('../middleware/error.middleware');
const authService = require('../services/auth.service');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  const { name, email, phone, password, countryCode } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email',
    });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    phone,
    password,
    countryCode: countryCode || '+237',
  });

  // Generate OTP and send email
  await authService.generateAndSendOTP(email);

  res.status(201).json({
    success: true,
    message: 'Registration successful. Please verify your email with OTP.',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isVerified: user.isVerified,
      },
    },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password',
    });
  }

  // Check for user and include password field
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Check if user is verified
  if (!user.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Please verify your email first. Check your email for OTP.',
    });
  }

  // Generate token
  const token = authService.generateToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
      },
    },
  });
});

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const result = await authService.verifyOTP(email, otp);

  res.status(200).json({
    success: true,
    message: result.message,
    data: {
      token: result.token,
      user: result.user,
    },
  });
});

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
exports.resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const result = await authService.generateAndSendOTP(email);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        countryCode: user.countryCode,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
    },
  });
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  await authService.generatePasswordResetToken(email);

  res.status(200).json({
    success: true,
    message: 'Password reset email sent',
  });
});

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.body;
  const { password } = req.body;

  await authService.resetPassword(token, password);

  res.status(200).json({
    success: true,
    message: 'Password reset successful',
  });
});

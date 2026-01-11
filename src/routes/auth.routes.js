const express = require('express');
const router = express.Router();
const {
  register,
  login,
  verifyOTP,
  resendOTP,
  getMe,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const {
  registerValidator,
  loginValidator,
  verifyOTPValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  handleValidationErrors,
} = require('../utils/validators');

// Public routes
router.post('/register', registerValidator, handleValidationErrors, register);
router.post('/login', loginValidator, handleValidationErrors, login);
router.post('/verify-otp', verifyOTPValidator, handleValidationErrors, verifyOTP);
router.post('/resend-otp', forgotPasswordValidator, handleValidationErrors, resendOTP);
router.post('/forgot-password', forgotPasswordValidator, handleValidationErrors, forgotPassword);
router.put('/reset-password', resetPasswordValidator, handleValidationErrors, resetPassword);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;

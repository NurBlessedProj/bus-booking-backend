const { body, query, param, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

exports.handleValidationErrors = handleValidationErrors;

// Auth validators
exports.registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('countryCode').optional().trim(),
];

exports.loginValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

exports.verifyOTPValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
];

exports.forgotPasswordValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
];

exports.resetPasswordValidator = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

// Bus validators
exports.searchBusValidator = [
  query('from').trim().notEmpty().withMessage('Origin location is required'),
  query('to').trim().notEmpty().withMessage('Destination location is required'),
  query('date').notEmpty().withMessage('Date is required'),
];

exports.createBusValidator = [
  body('agency').notEmpty().withMessage('Agency is required'),
  body('busNumber').trim().notEmpty().withMessage('Bus number is required'),
  body('route.from').trim().notEmpty().withMessage('Origin is required'),
  body('route.to').trim().notEmpty().withMessage('Destination is required'),
  body('departureTime').notEmpty().withMessage('Departure time is required'),
  body('arrivalTime').notEmpty().withMessage('Arrival time is required'),
  body('totalSeats').isInt({ min: 1 }).withMessage('Total seats must be at least 1'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
];

// Booking validators
exports.createBookingValidator = [
  body('bus').notEmpty().withMessage('Bus is required'),
  body('seats').isArray({ min: 1 }).withMessage('At least one seat must be selected'),
  body('passengers').isArray({ min: 1 }).withMessage('At least one passenger is required'),
  body('route.from').trim().notEmpty().withMessage('Origin is required'),
  body('route.to').trim().notEmpty().withMessage('Destination is required'),
  body('route.date').notEmpty().withMessage('Travel date is required'),
];

exports.updateBookingValidator = [
  body('status').optional().isIn(['Confirmed', 'Cancelled', 'Completed']).withMessage('Invalid status'),
];

// User validators
exports.updateProfileValidator = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('phone').optional().trim().notEmpty().withMessage('Phone cannot be empty'),
];

exports.changePasswordValidator = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
];

// Agency validators
exports.createAgencyValidator = [
  body('name').trim().notEmpty().withMessage('Agency name is required'),
];

// ID validator
exports.idValidator = [
  param('id').isMongoId().withMessage('Invalid ID format'),
];

// Review validators
exports.createReviewValidator = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().notEmpty().withMessage('Comment is required').isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters'),
  body('route').optional().trim(),
];

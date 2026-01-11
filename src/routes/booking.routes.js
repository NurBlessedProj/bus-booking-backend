const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBooking,
  cancelBooking,
  getBookingTicket,
} = require('../controllers/booking.controller');
const { protect } = require('../middleware/auth.middleware');
const {
  createBookingValidator,
  idValidator,
  handleValidationErrors,
} = require('../utils/validators');

// All routes are protected
router.use(protect);

router.post('/', createBookingValidator, handleValidationErrors, createBooking);
router.get('/', getMyBookings);
router.get('/:id', idValidator, handleValidationErrors, getBooking);
router.put('/:id/cancel', idValidator, handleValidationErrors, cancelBooking);
router.get('/:id/ticket', idValidator, handleValidationErrors, getBookingTicket);

module.exports = router;

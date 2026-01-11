const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  changePassword,
  getUserBookings,
} = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');
const {
  updateProfileValidator,
  changePasswordValidator,
  handleValidationErrors,
} = require('../utils/validators');

// All routes are protected
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfileValidator, handleValidationErrors, updateProfile);
router.put('/password', changePasswordValidator, handleValidationErrors, changePassword);
router.get('/bookings', getUserBookings);

module.exports = router;

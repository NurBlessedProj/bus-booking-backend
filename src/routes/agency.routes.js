const express = require('express');
const router = express.Router();
const {
  getAgencies,
  getAgency,
  getAgencyBuses,
  createAgency,
  updateAgency,
  deleteAgency,
  getAgencyReviews,
  createAgencyReview,
  checkCanReview,
} = require('../controllers/agency.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  createAgencyValidator,
  idValidator,
  createReviewValidator,
  handleValidationErrors,
} = require('../utils/validators');

// Public routes
router.get('/', getAgencies);
router.get('/:id', idValidator, handleValidationErrors, getAgency);
router.get('/:id/buses', idValidator, handleValidationErrors, getAgencyBuses);
router.get('/:id/reviews', idValidator, handleValidationErrors, getAgencyReviews);
router.get('/:id/can-review', protect, idValidator, handleValidationErrors, checkCanReview);

// Protected routes
router.post('/:id/reviews', protect, idValidator, createReviewValidator, handleValidationErrors, createAgencyReview);

// Protected/Admin routes
router.post('/', protect, authorize('admin'), createAgencyValidator, handleValidationErrors, createAgency);
router.put('/:id', protect, authorize('admin'), idValidator, handleValidationErrors, updateAgency);
router.delete('/:id', protect, authorize('admin'), idValidator, handleValidationErrors, deleteAgency);

module.exports = router;

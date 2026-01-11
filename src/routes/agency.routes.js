const express = require('express');
const router = express.Router();
const {
  getAgencies,
  getAgency,
  getAgencyBuses,
  createAgency,
  updateAgency,
  deleteAgency,
} = require('../controllers/agency.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  createAgencyValidator,
  idValidator,
  handleValidationErrors,
} = require('../utils/validators');

// Public routes
router.get('/', getAgencies);
router.get('/:id', idValidator, handleValidationErrors, getAgency);
router.get('/:id/buses', idValidator, handleValidationErrors, getAgencyBuses);

// Protected/Admin routes
router.post('/', protect, authorize('admin'), createAgencyValidator, handleValidationErrors, createAgency);
router.put('/:id', protect, authorize('admin'), idValidator, handleValidationErrors, updateAgency);
router.delete('/:id', protect, authorize('admin'), idValidator, handleValidationErrors, deleteAgency);

module.exports = router;

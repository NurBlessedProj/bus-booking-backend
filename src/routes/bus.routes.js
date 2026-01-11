const express = require('express');
const router = express.Router();
const {
  searchBuses,
  getBuses,
  getBus,
  getBusSeats,
  createBus,
  updateBus,
  deleteBus,
} = require('../controllers/bus.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  searchBusValidator,
  createBusValidator,
  idValidator,
  handleValidationErrors,
} = require('../utils/validators');

// Public routes
router.get('/search', searchBusValidator, handleValidationErrors, searchBuses);
router.get('/', getBuses);
router.get('/:id', idValidator, handleValidationErrors, getBus);
router.get('/:id/seats', idValidator, handleValidationErrors, getBusSeats);

// Protected/Admin routes
router.post('/', protect, authorize('admin'), createBusValidator, handleValidationErrors, createBus);
router.put('/:id', protect, authorize('admin'), idValidator, handleValidationErrors, updateBus);
router.delete('/:id', protect, authorize('admin'), idValidator, handleValidationErrors, deleteBus);

module.exports = router;

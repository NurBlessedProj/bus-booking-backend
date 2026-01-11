const Agency = require('../models/Agency.model');
const { asyncHandler } = require('../middleware/error.middleware');
const { paginate } = require('../utils/helpers');

// @desc    Get all agencies
// @route   GET /api/agencies
// @access  Public
exports.getAgencies = asyncHandler(async (req, res) => {
  const { skip, limit, page } = paginate(req.query.page, req.query.limit);

  const query = { isActive: true };

  const agencies = await Agency.find(query)
    .sort({ rating: -1, name: 1 })
    .skip(skip)
    .limit(limit);

  const total = await Agency.countDocuments(query);

  res.status(200).json({
    success: true,
    count: agencies.length,
    total,
    page,
    data: agencies,
  });
});

// @desc    Get single agency
// @route   GET /api/agencies/:id
// @access  Public
exports.getAgency = asyncHandler(async (req, res) => {
  const agency = await Agency.findById(req.params.id);

  if (!agency) {
    return res.status(404).json({
      success: false,
      message: 'Agency not found',
    });
  }

  res.status(200).json({
    success: true,
    data: agency,
  });
});

// @desc    Get agency buses
// @route   GET /api/agencies/:id/buses
// @access  Public
exports.getAgencyBuses = asyncHandler(async (req, res) => {
  const Bus = require('../models/Bus.model');
  const { skip, limit, page } = paginate(req.query.page, req.query.limit);

  const buses = await Bus.find({
    agency: req.params.id,
    isActive: true,
  })
    .sort({ departureTime: 1 })
    .skip(skip)
    .limit(limit);

  const total = await Bus.countDocuments({
    agency: req.params.id,
    isActive: true,
  });

  res.status(200).json({
    success: true,
    count: buses.length,
    total,
    page,
    data: buses,
  });
});

// @desc    Create agency
// @route   POST /api/agencies
// @access  Private/Admin
exports.createAgency = asyncHandler(async (req, res) => {
  const agency = await Agency.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Agency created successfully',
    data: agency,
  });
});

// @desc    Update agency
// @route   PUT /api/agencies/:id
// @access  Private/Admin
exports.updateAgency = asyncHandler(async (req, res) => {
  let agency = await Agency.findById(req.params.id);

  if (!agency) {
    return res.status(404).json({
      success: false,
      message: 'Agency not found',
    });
  }

  agency = await Agency.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Agency updated successfully',
    data: agency,
  });
});

// @desc    Delete agency
// @route   DELETE /api/agencies/:id
// @access  Private/Admin
exports.deleteAgency = asyncHandler(async (req, res) => {
  const agency = await Agency.findById(req.params.id);

  if (!agency) {
    return res.status(404).json({
      success: false,
      message: 'Agency not found',
    });
  }

  // Soft delete
  agency.isActive = false;
  await agency.save();

  res.status(200).json({
    success: true,
    message: 'Agency deleted successfully',
  });
});

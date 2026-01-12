const Agency = require('../models/Agency.model');
const Review = require('../models/Review.model');
const Booking = require('../models/Booking.model');
const Bus = require('../models/Bus.model');
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

// @desc    Get agency reviews
// @route   GET /api/agencies/:id/reviews
// @access  Public
exports.getAgencyReviews = asyncHandler(async (req, res) => {
  const agency = await Agency.findById(req.params.id);

  if (!agency) {
    return res.status(404).json({
      success: false,
      message: 'Agency not found',
    });
  }

  const { skip, limit, page } = paginate(req.query.page, req.query.limit);

  const reviews = await Review.find({ agency: req.params.id })
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Review.countDocuments({ agency: req.params.id });

  // Format reviews for frontend
  const formattedReviews = reviews.map(review => ({
    id: review._id,
    userName: review.user?.name || 'Anonymous',
    userEmail: review.user?.email || '',
    rating: review.rating,
    comment: review.comment,
    route: review.route || '',
    date: review.createdAt,
    createdAt: review.createdAt,
  }));

  res.status(200).json({
    success: true,
    count: reviews.length,
    total,
    page,
    data: formattedReviews,
  });
});

// @desc    Check if user can review agency
// @route   GET /api/agencies/:id/can-review
// @access  Private
exports.checkCanReview = asyncHandler(async (req, res) => {
  const agency = await Agency.findById(req.params.id);

  if (!agency) {
    return res.status(404).json({
      success: false,
      message: 'Agency not found',
    });
  }

  const userId = req.user._id;

  // Check if user has already reviewed
  const existingReview = await Review.findOne({
    user: userId,
    agency: req.params.id,
  });

  if (existingReview) {
    return res.status(200).json({
      success: true,
      data: {
        canReview: false,
        reason: 'You have already reviewed this agency',
      },
    });
  }

  // Check if user has booked with this agency
  const buses = await Bus.find({ agency: req.params.id }).select('_id');
  const busIds = buses.map(bus => bus._id);

  const hasBooked = await Booking.findOne({
    user: userId,
    bus: { $in: busIds },
    status: { $in: ['Confirmed', 'Completed'] },
  });

  res.status(200).json({
    success: true,
    data: {
      canReview: !!hasBooked,
      reason: hasBooked
        ? 'You can review this agency'
        : 'You must book with this agency before you can review',
    },
  });
});

// @desc    Create agency review
// @route   POST /api/agencies/:id/reviews
// @access  Private
exports.createAgencyReview = asyncHandler(async (req, res) => {
  const agency = await Agency.findById(req.params.id);

  if (!agency) {
    return res.status(404).json({
      success: false,
      message: 'Agency not found',
    });
  }

  const userId = req.user._id;

  // Check if user has already reviewed
  const existingReview = await Review.findOne({
    user: userId,
    agency: req.params.id,
  });

  if (existingReview) {
    return res.status(400).json({
      success: false,
      message: 'You have already reviewed this agency',
    });
  }

  // Check if user has booked with this agency
  const buses = await Bus.find({ agency: req.params.id }).select('_id');
  const busIds = buses.map(bus => bus._id);

  const hasBooked = await Booking.findOne({
    user: userId,
    bus: { $in: busIds },
    status: { $in: ['Confirmed', 'Completed'] },
  });

  if (!hasBooked) {
    return res.status(403).json({
      success: false,
      message: 'You must book with this agency before you can review',
    });
  }

  // Create review
  const review = await Review.create({
    user: userId,
    agency: req.params.id,
    rating: req.body.rating,
    comment: req.body.comment,
    route: req.body.route || '',
  });

  // Populate user data for response
  await review.populate('user', 'name email');

  // Format review for frontend
  const formattedReview = {
    id: review._id,
    userName: review.user?.name || 'Anonymous',
    userEmail: review.user?.email || '',
    rating: review.rating,
    comment: review.comment,
    route: review.route || '',
    date: review.createdAt,
    createdAt: review.createdAt,
  };

  res.status(201).json({
    success: true,
    message: 'Review created successfully',
    data: formattedReview,
  });
});

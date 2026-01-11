const User = require('../models/User.model');
const { asyncHandler } = require('../middleware/error.middleware');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = asyncHandler(async (req, res) => {
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

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res) => {
  const fieldsToUpdate = {
    name: req.body.name,
    phone: req.body.phone,
    countryCode: req.body.countryCode,
  };

  // Remove undefined fields
  Object.keys(fieldsToUpdate).forEach(
    (key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
  );

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
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

// @desc    Change password
// @route   PUT /api/users/password
// @access  Private
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(currentPassword))) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect',
    });
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
});

// @desc    Get user bookings
// @route   GET /api/users/bookings
// @access  Private
exports.getUserBookings = asyncHandler(async (req, res) => {
  const Booking = require('../models/Booking.model');
  const { status } = req.query;
  const { skip, limit, page } = require('../utils/helpers').paginate(
    req.query.page,
    req.query.limit
  );

  const query = { user: req.user.id };
  if (status) {
    query.status = status;
  }

  const bookings = await Booking.find(query)
    .populate('bus', 'busNumber type route departureTime arrivalTime')
    .populate({
      path: 'bus',
      populate: { path: 'agency', select: 'name logo' },
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Booking.countDocuments(query);

  res.status(200).json({
    success: true,
    count: bookings.length,
    total,
    page,
    data: bookings,
  });
});

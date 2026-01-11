const Booking = require('../models/Booking.model');
const Bus = require('../models/Bus.model');
const Seat = require('../models/Seat.model');
const { asyncHandler } = require('../middleware/error.middleware');
const { paginate, getStartOfDay } = require('../utils/helpers');
const emailService = require('../services/email.service');
const { BOOKING_STATUS, PAYMENT_STATUS } = require('../utils/constants');

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = asyncHandler(async (req, res) => {
  const { bus, seats, passengers, route, paymentMethod } = req.body;

  // Get bus details
  const busDetails = await Bus.findById(bus);
  if (!busDetails) {
    return res.status(404).json({
      success: false,
      message: 'Bus not found',
    });
  }

  // Check seat availability
  const bookingDate = getStartOfDay(new Date(route.date));
  const seatIds = [];
  let totalPrice = 0;

  for (const seatNumber of seats) {
    let seat = await Seat.findOne({
      bus,
      seatNumber,
      bookingDate,
    });

    if (!seat) {
      // Create seat if it doesn't exist
      seat = await Seat.create({
        bus,
        seatNumber,
        bookingDate,
        isAvailable: false,
        isBooked: true,
      });
    } else {
      if (seat.isBooked || !seat.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `Seat ${seatNumber} is already booked`,
        });
      }
      seat.isBooked = true;
      seat.isAvailable = false;
      await seat.save();
    }

    seatIds.push(seat._id);
    
    // Calculate price (check if VIP)
    const seatPrice = busDetails.isVIP ? busDetails.vipPrice : busDetails.price;
    totalPrice += seatPrice;
  }

  // Create booking
  const booking = await Booking.create({
    user: req.user.id,
    bus,
    seats: seatIds,
    passengers,
    route,
    totalPrice,
    paymentMethod: paymentMethod || 'Cash',
    paymentStatus: PAYMENT_STATUS.PAID, // Assuming immediate payment
  });

  // Update bus available seats
  busDetails.availableSeats -= seats.length;
  await busDetails.save();

  // Populate booking details
  await booking.populate([
    { path: 'bus', populate: { path: 'agency', select: 'name logo' } },
    { path: 'user', select: 'name email phone' },
  ]);

  // Send confirmation email
  try {
    await emailService.sendBookingConfirmationEmail(req.user.email, booking);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: booking,
  });
});

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
exports.getMyBookings = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const { skip, limit, page } = paginate(req.query.page, req.query.limit);

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

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('bus', 'busNumber type route departureTime arrivalTime amenities')
    .populate({
      path: 'bus',
      populate: { path: 'agency', select: 'name logo rating contact' },
    })
    .populate('seats', 'seatNumber type')
    .populate('user', 'name email phone');

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found',
    });
  }

  // Check if user owns this booking or is admin
  if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this booking',
    });
  }

  res.status(200).json({
    success: true,
    data: booking,
  });
});

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const booking = await Booking.findById(req.params.id)
    .populate('bus')
    .populate('seats');

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found',
    });
  }

  // Check if user owns this booking
  if (booking.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to cancel this booking',
    });
  }

  // Check if booking can be cancelled
  if (booking.status === BOOKING_STATUS.CANCELLED) {
    return res.status(400).json({
      success: false,
      message: 'Booking is already cancelled',
    });
  }

  if (booking.status === BOOKING_STATUS.COMPLETED) {
    return res.status(400).json({
      success: false,
      message: 'Completed bookings cannot be cancelled',
    });
  }

  // Cancel booking
  booking.status = BOOKING_STATUS.CANCELLED;
  booking.cancelledAt = new Date();
  booking.cancelledReason = reason || 'User cancelled';
  booking.paymentStatus = PAYMENT_STATUS.REFUNDED;

  // Free up seats
  for (const seat of booking.seats) {
    seat.isBooked = false;
    seat.isAvailable = true;
    await seat.save();
  }

  // Update bus available seats
  booking.bus.availableSeats += booking.seats.length;
  await booking.bus.save();

  await booking.save();

  // Send cancellation email
  try {
    await emailService.sendBookingCancellationEmail(req.user.email, booking);
  } catch (error) {
    console.error('Error sending cancellation email:', error);
  }

  res.status(200).json({
    success: true,
    message: 'Booking cancelled successfully',
    data: booking,
  });
});

// @desc    Get booking ticket/QR code
// @route   GET /api/bookings/:id/ticket
// @access  Private
exports.getBookingTicket = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('bus', 'busNumber type route')
    .populate({
      path: 'bus',
      populate: { path: 'agency', select: 'name logo' },
    })
    .populate('seats', 'seatNumber');

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found',
    });
  }

  // Check if user owns this booking
  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this ticket',
    });
  }

  res.status(200).json({
    success: true,
    data: {
      bookingId: booking.bookingId,
      qrCode: booking.qrCode,
      route: booking.route,
      agency: booking.bus.agency,
      seats: booking.seats.map((s) => s.seatNumber),
      passengers: booking.passengers,
      totalPrice: booking.totalPrice,
      status: booking.status,
    },
  });
});

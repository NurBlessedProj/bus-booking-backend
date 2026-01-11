const Bus = require('../models/Bus.model');
const Seat = require('../models/Seat.model');
const Booking = require('../models/Booking.model');
const Agency = require('../models/Agency.model');
const { asyncHandler } = require('../middleware/error.middleware');
const { getStartOfDay, getEndOfDay, paginate, calculateDuration } = require('../utils/helpers');

// @desc    Search buses
// @route   GET /api/buses/search
// @access  Public
exports.searchBuses = asyncHandler(async (req, res) => {
  const { from, to, date } = req.query;

  // Parse date
  const searchDate = new Date(date);
  const startOfDay = getStartOfDay(searchDate);
  const endOfDay = getEndOfDay(searchDate);

  // Build query
  const query = {
    'route.from': { $regex: from, $options: 'i' },
    'route.to': { $regex: to, $options: 'i' },
    departureTime: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    isActive: true,
  };

  // Execute query with pagination
  const { skip, limit, page } = paginate(req.query.page, req.query.limit);
  const buses = await Bus.find(query)
    .populate('agency', 'name logo rating amenities')
    .sort({ departureTime: 1 })
    .skip(skip)
    .limit(limit);

  const total = await Bus.countDocuments(query);

  res.status(200).json({
    success: true,
    count: buses.length,
    total,
    page,
    data: buses,
  });
});

// @desc    Get all buses
// @route   GET /api/buses
// @access  Public
exports.getBuses = asyncHandler(async (req, res) => {
  const { skip, limit, page } = paginate(req.query.page, req.query.limit);
  
  const query = { isActive: true };
  
  if (req.query.agency) {
    query.agency = req.query.agency;
  }

  const buses = await Bus.find(query)
    .populate('agency', 'name logo rating amenities')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Bus.countDocuments(query);

  res.status(200).json({
    success: true,
    count: buses.length,
    total,
    page,
    data: buses,
  });
});

// @desc    Get single bus
// @route   GET /api/buses/:id
// @access  Public
exports.getBus = asyncHandler(async (req, res) => {
  const bus = await Bus.findById(req.params.id)
    .populate('agency', 'name logo rating amenities contact description');

  if (!bus) {
    return res.status(404).json({
      success: false,
      message: 'Bus not found',
    });
  }

  res.status(200).json({
    success: true,
    data: bus,
  });
});

// @desc    Get bus seats
// @route   GET /api/buses/:id/seats
// @access  Public
exports.getBusSeats = asyncHandler(async (req, res) => {
  const { date } = req.query;
  const bus = await Bus.findById(req.params.id);

  if (!bus) {
    return res.status(404).json({
      success: false,
      message: 'Bus not found',
    });
  }

  const bookingDate = date ? getStartOfDay(new Date(date)) : getStartOfDay(new Date());

  // Get seats for this bus on this date
  let seats = await Seat.find({
    bus: req.params.id,
    bookingDate: bookingDate,
  });

  // If no seats exist, create them
  if (seats.length === 0) {
    const seatNumbers = [];
    for (let i = 1; i <= bus.totalSeats; i++) {
      seatNumbers.push(i.toString().padStart(2, '0'));
    }

    seats = await Seat.insertMany(
      seatNumbers.map((seatNum) => {
        // Determine seat type based on position (Window, Aisle, or Extra legroom)
        const seatNumInt = parseInt(seatNum);
        let seatType = "Window"; // Default
        // Simple logic: seats ending in 1,4 are often window, 2,3 are aisle
        const lastDigit = seatNumInt % 10;
        if (lastDigit === 1 || lastDigit === 4) {
          seatType = "Window";
        } else if (lastDigit === 2 || lastDigit === 3) {
          seatType = "Aisle";
        }
        
        return {
          bus: bus._id,
          seatNumber: seatNum,
          type: seatType,
          bookingDate: bookingDate,
          isAvailable: true,
          isBooked: false,
        };
      })
    );
  } else {
    // Ensure we have all seats (in case some were added later)
    const existingSeatNumbers = seats.map(s => s.seatNumber);
    const missingSeats = [];
    for (let i = 1; i <= bus.totalSeats; i++) {
      const seatNum = i.toString().padStart(2, '0');
      if (!existingSeatNumbers.includes(seatNum)) {
        const seatNumInt = parseInt(seatNum);
        let seatType = "Window";
        const lastDigit = seatNumInt % 10;
        if (lastDigit === 1 || lastDigit === 4) {
          seatType = "Window";
        } else if (lastDigit === 2 || lastDigit === 3) {
          seatType = "Aisle";
        }
        missingSeats.push({
          bus: bus._id,
          seatNumber: seatNum,
          type: seatType,
          bookingDate: bookingDate,
          isAvailable: true,
          isBooked: false,
        });
      }
    }
    if (missingSeats.length > 0) {
      const newSeats = await Seat.insertMany(missingSeats);
      seats = [...seats, ...newSeats];
    }
  }

  // Check for active bookings on this date and mark those seats as booked
  const startOfDay = getStartOfDay(bookingDate);
  const endOfDay = getEndOfDay(bookingDate);
  
  console.log(`🔍 Checking bookings for bus ${req.params.id}`);
  console.log(`🔍 Input date string: ${date}`);
  console.log(`🔍 Parsed bookingDate: ${bookingDate.toISOString()}`);
  console.log(`🔍 Date range: ${startOfDay.toISOString()} to ${endOfDay.toISOString()}`);
  
  // First, let's check ALL bookings for this bus to see what we have
  const allBusBookings = await Booking.find({ bus: req.params.id }).limit(5);
  console.log(`🔍 Total bookings for this bus: ${await Booking.countDocuments({ bus: req.params.id })}`);
  if (allBusBookings.length > 0) {
    console.log(`🔍 Sample booking dates: ${allBusBookings.map(b => b.route?.date?.toISOString()).join(', ')}`);
  }
  
  const activeBookings = await Booking.find({
    bus: req.params.id,
    'route.date': {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    status: { $in: ['Confirmed'] }, // Only confirmed bookings
  }).populate('seats', 'seatNumber');

  console.log(`🔍 Found ${activeBookings.length} active bookings for this date range`);
  if (activeBookings.length > 0) {
    activeBookings.forEach((booking, idx) => {
      console.log(`🔍 Booking ${idx + 1}: route.date=${booking.route?.date?.toISOString()}, seats=${booking.seats?.length || 0}`);
    });
  }

  // Get all booked seat numbers from active bookings
  const bookedSeatNumbers = new Set();
  activeBookings.forEach((booking) => {
    if (booking.seats && Array.isArray(booking.seats)) {
      booking.seats.forEach((seat) => {
        if (seat && seat.seatNumber) {
          bookedSeatNumbers.add(seat.seatNumber);
          console.log(`🔴 Found booked seat from booking: ${seat.seatNumber}`);
        }
      });
    }
  });

  // Also check seats that are already marked as booked in the database
  const bookedSeatsInDB = await Seat.find({
    bus: req.params.id,
    bookingDate: bookingDate,
    isBooked: true,
  });
  console.log(`🔍 Found ${bookedSeatsInDB.length} seats marked as booked in DB`);
  bookedSeatsInDB.forEach((seat) => {
    bookedSeatNumbers.add(seat.seatNumber);
    console.log(`🔴 Found booked seat in DB: ${seat.seatNumber}`);
  });

  console.log(`🔴 Total booked seat numbers: ${Array.from(bookedSeatNumbers).join(', ')}`);

  // Update seats to reflect booked status
  const updatedSeats = seats.map((seat) => {
    const seatObj = seat.toObject();
    const isBooked = bookedSeatNumbers.has(seat.seatNumber) || seatObj.isBooked;
    if (isBooked) {
      console.log(`✅ Marking seat ${seat.seatNumber} as booked`);
    }
    return {
      ...seatObj,
      isBooked: isBooked,
      isAvailable: !isBooked, // If booked, not available
    };
  });
  
  console.log(`📊 Returning ${updatedSeats.length} seats, ${updatedSeats.filter(s => s.isBooked).length} booked`);
  
  // Also update seats in database to keep them in sync
  for (const seat of seats) {
    const seatObj = seat.toObject();
    const isBooked = bookedSeatNumbers.has(seatObj.seatNumber);
    if (isBooked !== seatObj.isBooked) {
      seat.isBooked = isBooked;
      seat.isAvailable = !isBooked;
      await seat.save();
    }
  }

  res.status(200).json({
    success: true,
    count: updatedSeats.length,
    data: updatedSeats,
  });
});

// @desc    Create bus
// @route   POST /api/buses
// @access  Private/Admin
exports.createBus = asyncHandler(async (req, res) => {
  const {
    agency,
    busNumber,
    type,
    route,
    departureTime,
    arrivalTime,
    totalSeats,
    price,
    isVIP,
    amenities,
  } = req.body;

  // Calculate duration
  const duration = calculateDuration(departureTime, arrivalTime);

  const bus = await Bus.create({
    agency,
    busNumber,
    type,
    route,
    departureTime,
    arrivalTime,
    duration,
    totalSeats,
    availableSeats: totalSeats,
    price,
    vipPrice: isVIP ? price * 1.5 : price,
    isVIP: isVIP || false,
    amenities: amenities || [],
  });

  res.status(201).json({
    success: true,
    message: 'Bus created successfully',
    data: bus,
  });
});

// @desc    Update bus
// @route   PUT /api/buses/:id
// @access  Private/Admin
exports.updateBus = asyncHandler(async (req, res) => {
  let bus = await Bus.findById(req.params.id);

  if (!bus) {
    return res.status(404).json({
      success: false,
      message: 'Bus not found',
    });
  }

  bus = await Bus.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Bus updated successfully',
    data: bus,
  });
});

// @desc    Delete bus
// @route   DELETE /api/buses/:id
// @access  Private/Admin
exports.deleteBus = asyncHandler(async (req, res) => {
  const bus = await Bus.findById(req.params.id);

  if (!bus) {
    return res.status(404).json({
      success: false,
      message: 'Bus not found',
    });
  }

  // Soft delete by setting isActive to false
  bus.isActive = false;
  await bus.save();

  res.status(200).json({
    success: true,
    message: 'Bus deleted successfully',
  });
});

const mongoose = require('mongoose');
const crypto = require('crypto');

const passengerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  seatNumber: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },
});

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: [true, 'Bus is required'],
  },
  seats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seat',
  }],
  passengers: [passengerSchema],
  route: {
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    departureTime: {
      type: String,
      required: true,
    },
    arrivalTime: {
      type: String,
      required: true,
    },
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: 0,
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Cancelled', 'Completed'],
    default: 'Confirmed',
  },
  bookingId: {
    type: String,
    unique: true,
    required: true,
  },
  qrCode: {
    type: String,
    default: '',
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card', 'Wallet'],
    default: 'Cash',
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending',
  },
  cancelledAt: {
    type: Date,
  },
  cancelledReason: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate unique booking ID before saving
bookingSchema.pre('save', async function (next) {
  if (!this.bookingId) {
    let bookingId;
    let isUnique = false;
    
    while (!isUnique) {
      bookingId = 'BK' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const existingBooking = await this.constructor.findOne({ bookingId });
      if (!existingBooking) {
        isUnique = true;
      }
    }
    
    this.bookingId = bookingId;
    
    // Generate QR code
    this.qrCode = crypto.randomBytes(16).toString('hex');
  }
  
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);

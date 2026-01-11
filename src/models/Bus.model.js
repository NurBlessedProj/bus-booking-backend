const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  agency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agency',
    required: [true, 'Agency is required'],
  },
  busNumber: {
    type: String,
    required: [true, 'Bus number is required'],
    unique: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['Luxury', 'Standard', 'Economy'],
    default: 'Standard',
  },
  route: {
    from: {
      type: String,
      required: [true, 'Origin is required'],
    },
    to: {
      type: String,
      required: [true, 'Destination is required'],
    },
  },
  departureTime: {
    type: Date,
    required: [true, 'Departure time is required'],
  },
  arrivalTime: {
    type: Date,
    required: [true, 'Arrival time is required'],
  },
  duration: {
    type: Number, // in minutes
    required: true,
  },
  totalSeats: {
    type: Number,
    required: [true, 'Total seats is required'],
    default: 40,
  },
  availableSeats: {
    type: Number,
    default: function() {
      return this.totalSeats;
    },
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  vipPrice: {
    type: Number,
    default: function() {
      return this.price * 1.5; // VIP is 50% more expensive
    },
  },
  isVIP: {
    type: Boolean,
    default: false,
  },
  amenities: [{
    type: String,
  }],
  isActive: {
    type: Boolean,
    default: true,
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

busSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Bus', busSchema);

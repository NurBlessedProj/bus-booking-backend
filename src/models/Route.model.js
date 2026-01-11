const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  from: {
    type: String,
    required: [true, 'Origin location is required'],
    trim: true,
  },
  to: {
    type: String,
    required: [true, 'Destination location is required'],
    trim: true,
  },
  distance: {
    type: Number, // in kilometers
    default: 0,
  },
  duration: {
    type: Number, // in minutes
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Route', routeSchema);

const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: [true, 'Bus is required'],
  },
  seatNumber: {
    type: String,
    required: [true, 'Seat number is required'],
  },
  type: {
    type: String,
    enum: ['Window', 'Aisle', 'Extra legroom'],
    default: 'Window',
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
  bookingDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to ensure unique seat per bus on a date
seatSchema.index({ bus: 1, seatNumber: 1, bookingDate: 1 }, { unique: true });

module.exports = mongoose.model('Seat', seatSchema);

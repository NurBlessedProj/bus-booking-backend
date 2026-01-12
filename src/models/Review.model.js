const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
  agency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agency',
    required: [true, 'Agency is required'],
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must be at most 5'],
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    trim: true,
    maxlength: [500, 'Comment cannot exceed 500 characters'],
  },
  route: {
    type: String,
    trim: true,
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

// Prevent duplicate reviews from same user for same agency
reviewSchema.index({ user: 1, agency: 1 }, { unique: true });

// Update timestamp on save
reviewSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to update agency rating
reviewSchema.statics.updateAgencyRating = async function (agencyId) {
  const Agency = require('./Agency.model');
  
  const reviews = await this.find({ agency: agencyId });
  
  if (reviews.length === 0) {
    await Agency.findByIdAndUpdate(agencyId, { rating: 0 });
    return;
  }
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;
  
  await Agency.findByIdAndUpdate(agencyId, {
    rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
  });
};

// Update agency rating after review is saved
reviewSchema.post('save', async function () {
  await this.constructor.updateAgencyRating(this.agency);
});

// Update agency rating after review is deleted
reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.updateAgencyRating(doc.agency);
  }
});

module.exports = mongoose.model('Review', reviewSchema);

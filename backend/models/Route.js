const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
    required: true
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
    required: true
  },
  distance: {
    type: Number,
    required: true // in km
  },
  estimatedDuration: {
    type: Number,
    required: true // in hours
  },
  routeType: {
    type: String,
    enum: ['Direct', 'Via Highway', 'Scenic', 'Shortest', 'Estimated'],
    default: 'Direct'
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create compound index for efficient searching
routeSchema.index({ isPopular: 1, isActive: 1 });

// Ensure unique route combinations
routeSchema.index({ from: 1, to: 1 }, { unique: true });

module.exports = mongoose.model('Route', routeSchema);
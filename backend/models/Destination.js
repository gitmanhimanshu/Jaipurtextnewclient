const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['Religious', 'Historical', 'Tourist', 'Business', 'Pilgrimage', 'Adventure', 'Cultural'],
    required: true
  },
  distanceFromJaipur: {
    type: Number,
    required: true // in km
  },
  estimatedDuration: {
    type: Number,
    required: true // in hours
  },
  popularity: {
    type: Number,
    default: 1,
    min: 1,
    max: 10
  },
  description: {
    type: String,
    required: true
  },
  highlights: [{
    type: String
  }],
  image: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create index for search functionality
destinationSchema.index({ name: 'text', state: 'text', description: 'text' });
destinationSchema.index({ category: 1 });
destinationSchema.index({ popularity: -1 });

module.exports = mongoose.model('Destination', destinationSchema);



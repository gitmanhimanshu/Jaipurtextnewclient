const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
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
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  popularity: {
    type: Number,
    default: 1,
    min: 1,
    max: 10
  }
}, {
  timestamps: true
});

// Create index for search functionality
placeSchema.index({ name: 'text', state: 'text', description: 'text' });
placeSchema.index({ category: 1 });
placeSchema.index({ popularity: -1 });

module.exports = mongoose.model('Place', placeSchema);


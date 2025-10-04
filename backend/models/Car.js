const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Sedan', 'Ertiga', 'Innova', 'Innova Crysta'],
    required: true
  },
  pricePerKm: {
    type: Number,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  features: [{
    type: String
  }],
  available: {
    type: Boolean,
    default: true
  },
  image: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Car', carSchema);


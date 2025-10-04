const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  distance: {
    type: Number,
    required: true // in km
  },
  duration: {
    hours: {
      type: Number,
      required: true
    }
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
  available: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tour', tourSchema);










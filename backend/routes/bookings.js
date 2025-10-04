const express = require('express');
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const Tour = require('../models/Tour');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const {
      type,
      carId,
      tourId,
      pickupLocation,
      dropLocation,
      pickupDate,
      pickupTime,
      distance,
      passengers,
      contactNumber
    } = req.body;

    let totalAmount = 0;

    if (type === 'car' && carId) {
      const car = await Car.findById(carId);
      if (!car) return res.status(404).json({ message: 'Car not found' });
      totalAmount = car.pricePerKm * distance;
    } else if (type === 'tour' && tourId) {
      const tour = await Tour.findById(tourId);
      if (!tour) return res.status(404).json({ message: 'Tour not found' });
      // Tour pricing can be fixed or calculated based on car type
      totalAmount = tour.type === 'fixed' ? tour.price : 500; // Default tour price
    }

    const booking = new Booking({
      user: req.user._id,
      type,
      car: type === 'car' ? carId : null,
      tour: type === 'tour' ? tourId : null,
      pickupLocation,
      dropLocation,
      pickupDate,
      pickupTime,
      distance,
      totalAmount,
      passengers,
      contactNumber
    });

    await booking.save();

    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('car')
      .populate('tour')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get booking by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('car')
      .populate('tour')
      .populate('user');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns booking or is admin
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;










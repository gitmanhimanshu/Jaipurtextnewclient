const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Car = require('./models/Car');
const Tour = require('./models/Tour');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const cars = [
  {
    name: 'Maruti Ertiga',
    type: 'Ertiga',
    pricePerKm: 14,
    capacity: 7,
    features: ['AC', 'Music System', 'Extra Space'],
    description: '7-seater MPV perfect for family trips',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=500&h=300&fit=crop'
  },
  {
    name: 'Toyota Innova',
    type: 'Innova',
    pricePerKm: 16,
    capacity: 7,
    features: ['AC', 'Music System', 'Comfortable Seating'],
    description: 'Reliable and comfortable SUV for long journeys',
    image: 'https://images.unsplash.com/photo-1558618047-7c0b0b0b0b0b?w=500&h=300&fit=crop'
  },
  {
    name: 'Toyota Innova Crysta',
    type: 'Innova Crysta',
    pricePerKm: 18,
    capacity: 7,
    features: ['AC', 'Music System', 'Premium Interior', 'LED Headlights'],
    description: 'Premium SUV with luxury features',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=500&h=300&fit=crop'
  }
];

const tours = [
  {
    name: 'Jaipur to Sawariya Seth',
    from: 'Jaipur',
    to: 'Sawariya Seth',
    distance: 75,
    duration: { hours: 2 },
    description: 'Visit the famous Sawariya Seth temple, a popular pilgrimage destination',
    highlights: ['Temple Visit', 'Scenic Route', 'Cultural Experience'],
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&h=300&fit=crop'
  },
  {
    name: 'Jaipur to Udaipur',
    from: 'Jaipur',
    to: 'Udaipur',
    distance: 380,
    duration: { hours: 6 },
    description: 'City of Lakes - Explore the royal heritage and beautiful lakes',
    highlights: ['City Palace', 'Lake Pichola', 'Royal Heritage', 'Art & Culture'],
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop'
  },
  {
    name: 'Jaipur to Khatushyamji',
    from: 'Jaipur',
    to: 'Khatushyamji',
    distance: 45,
    duration: { hours: 1.5 },
    description: 'Sacred pilgrimage to Baba Khatushyam temple',
    highlights: ['Temple Visit', 'Pilgrimage Experience', 'Spiritual Journey'],
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&h=300&fit=crop'
  },
  {
    name: 'Jaipur to Salasar',
    from: 'Jaipur',
    to: 'Salasar Balaji',
    distance: 180,
    duration: { hours: 4 },
    description: 'Visit the famous Salasar Balaji temple',
    highlights: ['Temple Visit', 'Religious Significance', 'Pilgrimage Tour'],
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&h=300&fit=crop'
  }
];

async function seed() {
  try {
    // Clear existing data
    await Car.deleteMany({});
    await Tour.deleteMany({});
    
    console.log('Cleared existing data');

    // Insert cars
    await Car.insertMany(cars);
    console.log('Cars seeded successfully');

    // Insert tours
    await Tour.insertMany(tours);
    console.log('Tours seeded successfully');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();




const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Destination = require('./models/Destination');
const Route = require('./models/Route');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const destinations = [
  // Religious Places
  {
    name: 'Sawariya Seth',
    state: 'Rajasthan',
    category: 'Religious',
    distanceFromJaipur: 75,
    estimatedDuration: 2,
    popularity: 9,
    description: 'Famous temple dedicated to Sawariya Seth, a popular pilgrimage destination',
    highlights: ['Temple Visit', 'Religious Significance', 'Pilgrimage Experience'],
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&h=300&fit=crop'
  },
  {
    name: 'Khatushyamji',
    state: 'Rajasthan',
    category: 'Religious',
    distanceFromJaipur: 45,
    estimatedDuration: 1.5,
    popularity: 8,
    description: 'Sacred pilgrimage site dedicated to Baba Khatushyam',
    highlights: ['Temple Visit', 'Spiritual Journey', 'Religious Significance'],
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&h=300&fit=crop'
  },
  {
    name: 'Salasar Balaji',
    state: 'Rajasthan',
    category: 'Religious',
    distanceFromJaipur: 180,
    estimatedDuration: 4,
    popularity: 7,
    description: 'Famous temple of Lord Hanuman, known as Salasar Balaji',
    highlights: ['Temple Visit', 'Religious Significance', 'Pilgrimage Tour'],
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&h=300&fit=crop'
  },
  {
    name: 'Pushkar',
    state: 'Rajasthan',
    category: 'Religious',
    distanceFromJaipur: 150,
    estimatedDuration: 3,
    popularity: 8,
    description: 'Sacred city with the only Brahma temple in the world',
    highlights: ['Brahma Temple', 'Sacred Lake', 'Camel Fair', 'Spiritual Experience'],
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop'
  },
  {
    name: 'Ajmer Sharif',
    state: 'Rajasthan',
    category: 'Religious',
    distanceFromJaipur: 135,
    estimatedDuration: 2.5,
    popularity: 9,
    description: 'Famous Sufi shrine of Khwaja Moinuddin Chishti',
    highlights: ['Dargah Visit', 'Sufi Culture', 'Religious Harmony', 'Spiritual Experience'],
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&h=300&fit=crop'
  },

  // Historical Places
  {
    name: 'Amer Fort',
    state: 'Rajasthan',
    category: 'Historical',
    distanceFromJaipur: 11,
    estimatedDuration: 0.5,
    popularity: 10,
    description: 'Magnificent fort with stunning architecture and history',
    highlights: ['Fort Architecture', 'Elephant Ride', 'Light Show', 'Historical Significance'],
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop'
  },
  {
    name: 'Hawa Mahal',
    state: 'Rajasthan',
    category: 'Historical',
    distanceFromJaipur: 0,
    estimatedDuration: 0,
    popularity: 10,
    description: 'Iconic palace with 953 windows, symbol of Jaipur',
    highlights: ['Palace of Winds', 'Architecture', 'Photography', 'City Palace'],
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop'
  },
  {
    name: 'Jantar Mantar',
    state: 'Rajasthan',
    category: 'Historical',
    distanceFromJaipur: 0,
    estimatedDuration: 0,
    popularity: 8,
    description: 'UNESCO World Heritage astronomical observatory',
    highlights: ['Astronomical Instruments', 'UNESCO Site', 'Scientific Heritage', 'Historical Significance'],
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop'
  },
  {
    name: 'City Palace',
    state: 'Rajasthan',
    category: 'Historical',
    distanceFromJaipur: 0,
    estimatedDuration: 0,
    popularity: 9,
    description: 'Royal palace complex with museums and courtyards',
    highlights: ['Royal Heritage', 'Museums', 'Architecture', 'Cultural Experience'],
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop'
  },

  // Tourist Destinations
  {
    name: 'Udaipur',
    state: 'Rajasthan',
    category: 'Tourist',
    distanceFromJaipur: 380,
    estimatedDuration: 6,
    popularity: 9,
    description: 'City of Lakes with beautiful palaces and romantic atmosphere',
    highlights: ['Lake Pichola', 'City Palace', 'Jag Mandir', 'Boat Ride', 'Royal Heritage'],
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop'
  },
  {
    name: 'Jodhpur',
    state: 'Rajasthan',
    category: 'Tourist',
    distanceFromJaipur: 340,
    estimatedDuration: 5.5,
    popularity: 8,
    description: 'Blue City with magnificent Mehrangarh Fort',
    highlights: ['Mehrangarh Fort', 'Blue Houses', 'Clock Tower', 'Royal Heritage', 'Photography'],
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop'
  },
  {
    name: 'Jaisalmer',
    state: 'Rajasthan',
    category: 'Tourist',
    distanceFromJaipur: 560,
    estimatedDuration: 8,
    popularity: 7,
    description: 'Golden City in the heart of Thar Desert',
    highlights: ['Golden Fort', 'Desert Safari', 'Sand Dunes', 'Camel Ride', 'Cultural Experience'],
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop'
  },
  {
    name: 'Bikaner',
    state: 'Rajasthan',
    category: 'Tourist',
    distanceFromJaipur: 330,
    estimatedDuration: 5,
    popularity: 6,
    description: 'Desert city known for its forts and camel breeding farm',
    highlights: ['Junagarh Fort', 'Camel Farm', 'Desert Culture', 'Royal Heritage'],
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop'
  },
  {
    name: 'Mount Abu',
    state: 'Rajasthan',
    category: 'Tourist',
    distanceFromJaipur: 480,
    estimatedDuration: 7,
    popularity: 7,
    description: 'Only hill station in Rajasthan with beautiful lakes and temples',
    highlights: ['Nakki Lake', 'Dilwara Temples', 'Sunset Point', 'Cool Climate', 'Nature'],
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop'
  },

  // Business Destinations
  {
    name: 'Delhi',
    state: 'Delhi',
    category: 'Business',
    distanceFromJaipur: 280,
    estimatedDuration: 4.5,
    popularity: 9,
    description: 'Capital city with business opportunities and historical monuments',
    highlights: ['Business Hub', 'Historical Monuments', 'Shopping', 'Cultural Diversity'],
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop'
  },
  {
    name: 'Mumbai',
    state: 'Maharashtra',
    category: 'Business',
    distanceFromJaipur: 1200,
    estimatedDuration: 18,
    popularity: 8,
    description: 'Financial capital of India with Bollywood and business opportunities',
    highlights: ['Business Hub', 'Bollywood', 'Gateway of India', 'Marine Drive', 'Shopping'],
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop'
  },
  {
    name: 'Bangalore',
    state: 'Karnataka',
    category: 'Business',
    distanceFromJaipur: 1400,
    estimatedDuration: 20,
    popularity: 7,
    description: 'IT hub of India with pleasant weather and tech opportunities',
    highlights: ['IT Hub', 'Tech Parks', 'Garden City', 'Startup Culture', 'Modern Infrastructure'],
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop'
  },

  // Adventure Destinations
  {
    name: 'Ranthambore',
    state: 'Rajasthan',
    category: 'Adventure',
    distanceFromJaipur: 180,
    estimatedDuration: 3.5,
    popularity: 8,
    description: 'Famous tiger reserve for wildlife safari and adventure',
    highlights: ['Tiger Safari', 'Wildlife Photography', 'Nature', 'Adventure', 'Conservation'],
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop'
  },
  {
    name: 'Keoladeo National Park',
    state: 'Rajasthan',
    category: 'Adventure',
    distanceFromJaipur: 180,
    estimatedDuration: 3.5,
    popularity: 7,
    description: 'UNESCO World Heritage bird sanctuary',
    highlights: ['Bird Watching', 'Wildlife Photography', 'Nature', 'Conservation', 'UNESCO Site'],
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop'
  }
];

const popularRoutes = [
  { from: 'Jaipur', to: 'Udaipur', distance: 380, estimatedDuration: 6, isPopular: true, searchCount: 150 },
  { from: 'Jaipur', to: 'Jodhpur', distance: 340, estimatedDuration: 5.5, isPopular: true, searchCount: 120 },
  { from: 'Jaipur', to: 'Delhi', distance: 280, estimatedDuration: 4.5, isPopular: true, searchCount: 200 },
  { from: 'Jaipur', to: 'Ajmer', distance: 135, estimatedDuration: 2.5, isPopular: true, searchCount: 100 },
  { from: 'Jaipur', to: 'Pushkar', distance: 150, estimatedDuration: 3, isPopular: true, searchCount: 80 },
  { from: 'Jaipur', to: 'Sawariya Seth', distance: 75, estimatedDuration: 2, isPopular: true, searchCount: 90 },
  { from: 'Jaipur', to: 'Khatushyamji', distance: 45, estimatedDuration: 1.5, isPopular: true, searchCount: 70 },
  { from: 'Jaipur', to: 'Salasar', distance: 180, estimatedDuration: 4, isPopular: true, searchCount: 60 },
  { from: 'Jaipur', to: 'Ranthambore', distance: 180, estimatedDuration: 3.5, isPopular: true, searchCount: 50 },
  { from: 'Jaipur', to: 'Jaisalmer', distance: 560, estimatedDuration: 8, isPopular: true, searchCount: 40 }
];

async function seedDestinations() {
  try {
    // Clear existing data
    await Destination.deleteMany({});
    await Route.deleteMany({});
    
    console.log('Cleared existing destination data');

    // Insert destinations
    await Destination.insertMany(destinations);
    console.log('Destinations seeded successfully');

    // Insert popular routes
    await Route.insertMany(popularRoutes);
    console.log('Popular routes seeded successfully');

    console.log('Destination database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedDestinations();



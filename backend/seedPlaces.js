const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Place = require('./models/Place');
const Route = require('./models/Route');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const places = [
  // Starting Point
  {
    name: 'Jaipur',
    state: 'Rajasthan',
    category: 'Historical',
    description: 'Pink City - Capital of Rajasthan with rich history and culture',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop',
    popularity: 10
  },

  // Religious Places
  {
    name: 'Sawariya Seth',
    state: 'Rajasthan',
    category: 'Religious',
    description: 'Famous temple dedicated to Sawariya Seth, a popular pilgrimage destination',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&h=300&fit=crop',
    popularity: 9
  },
  {
    name: 'Khatushyamji',
    state: 'Rajasthan',
    category: 'Religious',
    description: 'Sacred pilgrimage site dedicated to Baba Khatushyam',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&h=300&fit=crop',
    popularity: 8
  },
  {
    name: 'Salasar Balaji',
    state: 'Rajasthan',
    category: 'Religious',
    description: 'Famous temple of Lord Hanuman, known as Salasar Balaji',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&h=300&fit=crop',
    popularity: 7
  },
  {
    name: 'Pushkar',
    state: 'Rajasthan',
    category: 'Religious',
    description: 'Sacred city with the only Brahma temple in the world',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop',
    popularity: 8
  },
  {
    name: 'Ajmer Sharif',
    state: 'Rajasthan',
    category: 'Religious',
    description: 'Famous Sufi shrine of Khwaja Moinuddin Chishti',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&h=300&fit=crop',
    popularity: 9
  },

  // Tourist Destinations
  {
    name: 'Udaipur',
    state: 'Rajasthan',
    category: 'Tourist',
    description: 'City of Lakes with beautiful palaces and romantic atmosphere',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop',
    popularity: 9
  },
  {
    name: 'Jodhpur',
    state: 'Rajasthan',
    category: 'Tourist',
    description: 'Blue City with magnificent Mehrangarh Fort',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop',
    popularity: 8
  },
  {
    name: 'Jaisalmer',
    state: 'Rajasthan',
    category: 'Tourist',
    description: 'Golden City in the heart of Thar Desert',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop',
    popularity: 7
  },
  {
    name: 'Bikaner',
    state: 'Rajasthan',
    category: 'Tourist',
    description: 'Desert city known for its forts and camel breeding farm',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop',
    popularity: 6
  },
  {
    name: 'Mount Abu',
    state: 'Rajasthan',
    category: 'Tourist',
    description: 'Only hill station in Rajasthan with beautiful lakes and temples',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop',
    popularity: 7
  },

  // Business Destinations
  {
    name: 'Delhi',
    state: 'Delhi',
    category: 'Business',
    description: 'Capital city with business opportunities and historical monuments',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop',
    popularity: 9
  },
  {
    name: 'Mumbai',
    state: 'Maharashtra',
    category: 'Business',
    description: 'Financial capital of India with Bollywood and business opportunities',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop',
    popularity: 8
  },
  {
    name: 'Bangalore',
    state: 'Karnataka',
    category: 'Business',
    description: 'IT hub of India with pleasant weather and tech opportunities',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop',
    popularity: 7
  },

  // Historical Places
  {
    name: 'Amer Fort',
    state: 'Rajasthan',
    category: 'Historical',
    description: 'Magnificent fort with stunning architecture and history',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop',
    popularity: 10
  },
  {
    name: 'Hawa Mahal',
    state: 'Rajasthan',
    category: 'Historical',
    description: 'Iconic palace with 953 windows, symbol of Jaipur',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop',
    popularity: 10
  },
  {
    name: 'Jantar Mantar',
    state: 'Rajasthan',
    category: 'Historical',
    description: 'UNESCO World Heritage astronomical observatory',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop',
    popularity: 10
  },
  {
    name: 'City Palace',
    state: 'Rajasthan',
    category: 'Historical',
    description: 'Royal palace complex with museums and courtyards',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop',
    popularity: 10
  },

  // Small Places within Jaipur City
  {
    name: 'Nahargarh Fort',
    state: 'Rajasthan',
    category: 'Historical',
    description: 'Hilltop fort offering panoramic views of Jaipur city',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop',
    popularity: 9
  },
  {
    name: 'Jal Mahal',
    state: 'Rajasthan',
    category: 'Historical',
    description: 'Water palace in the middle of Man Sagar Lake',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop',
    popularity: 9
  },
  {
    name: 'Albert Hall Museum',
    state: 'Rajasthan',
    category: 'Cultural',
    description: 'Oldest museum in Rajasthan with rich collection of artifacts',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop',
    popularity: 8
  },
  {
    name: 'Birla Mandir',
    state: 'Rajasthan',
    category: 'Religious',
    description: 'Beautiful white marble temple dedicated to Lord Vishnu and Goddess Lakshmi',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&h=300&fit=crop',
    popularity: 8
  },
  {
    name: 'Galtaji Temple',
    state: 'Rajasthan',
    category: 'Religious',
    description: 'Monkey temple with natural springs and beautiful architecture',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&h=300&fit=crop',
    popularity: 7
  },
  {
    name: 'Sisodia Rani Garden',
    state: 'Rajasthan',
    category: 'Tourist',
    description: 'Beautiful landscaped garden with fountains and pavilions',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop',
    popularity: 7
  },
  {
    name: 'Central Park',
    state: 'Rajasthan',
    category: 'Tourist',
    description: 'Large public park in the heart of Jaipur with jogging tracks',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop',
    popularity: 6
  },
  {
    name: 'Rambagh Palace',
    state: 'Rajasthan',
    category: 'Historical',
    description: 'Former royal residence, now a luxury hotel with beautiful gardens',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop',
    popularity: 8
  },
  {
    name: 'Jaipur Zoo',
    state: 'Rajasthan',
    category: 'Tourist',
    description: 'Well-maintained zoo with various species of animals and birds',
    image: 'https://images.unsplash.com/photo-1564507592333/c60657eea523?w=500&h=300&fit=crop',
    popularity: 6
  },
  {
    name: 'Raj Mandir Cinema',
    state: 'Rajasthan',
    category: 'Cultural',
    description: 'Famous heritage cinema hall known for its grand architecture',
    image: 'https://images.unsplash.com/photo-1564507592333/c60657eea523?w=500&h=300&fit=crop',
    popularity: 7
  },
  {
    name: 'Chokhi Dhani',
    state: 'Rajasthan',
    category: 'Cultural',
    description: 'Ethnic village resort showcasing Rajasthani culture and traditions',
    image: 'https://images.unsplash.com/photo-1564507592333/c60657eea523?w=500&h=300&fit=crop',
    popularity: 8
  },
  {
    name: 'World Trade Park',
    state: 'Rajasthan',
    category: 'Business',
    description: 'Modern shopping and business complex in Jaipur',
    image: 'https://images.unsplash.com/photo-1564507592333/c60657eea523?w=500&h=300&fit=crop',
    popularity: 6
  },
  {
    name: 'Pink City Market',
    state: 'Rajasthan',
    category: 'Cultural',
    description: 'Famous market for traditional Rajasthani handicrafts and jewelry',
    image: 'https://images.unsplash.com/photo-1564507592333/c60657eea523?w=500&h=300&fit=crop',
    popularity: 8
  },
  {
    name: 'Jaipur Railway Station',
    state: 'Rajasthan',
    category: 'Business',
    description: 'Heritage railway station with beautiful architecture',
    image: 'https://images.unsplash.com/photo-1564507592333/c60657eea523?w=500&h=300&fit=crop',
    popularity: 5
  },
  {
    name: 'Sanganer Airport',
    state: 'Rajasthan',
    category: 'Business',
    description: 'Jaipur International Airport for domestic and international flights',
    image: 'https://images.unsplash.com/photo-1564507592333/c60657eea523?w=500&h=300&fit=crop',
    popularity: 5
  },

  // Famous Statues and Monuments in Jaipur
  {
    name: 'Statue Circle',
    state: 'Rajasthan',
    category: 'Historical',
    description: 'Famous traffic circle with beautiful statues and monuments in the heart of Jaipur',
    image: 'https://images.unsplash.com/photo-1564507592333/c60657eea523?w=500&h=300&fit=crop',
    popularity: 8
  },
  {
    name: 'Jawahar Circle',
    state: 'Rajasthan',
    category: 'Tourist',
    description: 'Beautiful circular park with Patrika Gate and famous architecture',
    image: 'https://images.unsplash.com/photo-1564507592333/c60657eea523?w=500&h=300&fit=crop',
    popularity: 7
  },
  {
    name: 'Patrika Gate',
    state: 'Rajasthan',
    category: 'Historical',
    description: 'Famous colorful gate at Jawahar Circle, perfect for photography',
    image: 'https://images.unsplash.com/photo-1564507592333/c60657eea523?w=500&h=300&fit=crop',
    popularity: 8
  },
  {
    name: 'Ganesh Temple (Galtaji)',
    state: 'Rajasthan',
    category: 'Religious',
    description: 'Famous temple with natural springs and beautiful Ganesh statue',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&h=300&fit=crop',
    popularity: 7
  },
  {
    name: 'Govind Devji Temple',
    state: 'Rajasthan',
    category: 'Religious',
    description: 'Famous Krishna temple in City Palace complex',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&h=300&fit=crop',
    popularity: 8
  },
  {
    name: 'Laxmi Narayan Temple (Birla Mandir)',
    state: 'Rajasthan',
    category: 'Religious',
    description: 'Beautiful white marble temple dedicated to Lord Vishnu and Goddess Lakshmi',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&h=300&fit=crop',
    popularity: 8
  },
  {
    name: 'Vidyadhar Garden',
    state: 'Rajasthan',
    category: 'Tourist',
    description: 'Beautiful garden with Mughal-style architecture and fountains',
    image: 'https://images.unsplash.com/photo-1564507592333/c60657eea523?w=500&h=300&fit=crop',
    popularity: 6
  },
  {
    name: 'Kanak Vrindavan',
    state: 'Rajasthan',
    category: 'Religious',
    description: 'Beautiful garden temple complex with Krishna temples and fountains',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&h=300&fit=crop',
    popularity: 7
  },
  {
    name: 'Jaipur Wax Museum',
    state: 'Rajasthan',
    category: 'Cultural',
    description: 'Interactive wax museum with famous personalities and historical figures',
    image: 'https://images.unsplash.com/photo-1564507592333/c60657eea523?w=500&h=300&fit=crop',
    popularity: 6
  },
  {
    name: 'Jawahar Kala Kendra',
    state: 'Rajasthan',
    category: 'Cultural',
    description: 'Art and cultural center designed by Charles Correa',
    image: 'https://images.unsplash.com/photo-1564507592333/c60657eea523?w=500&h=300&fit=crop',
    popularity: 6
  },
  {
    name: 'Central Museum (Albert Hall)',
    state: 'Rajasthan',
    category: 'Cultural',
    description: 'Oldest museum in Rajasthan with rich collection of artifacts and sculptures',
    image: 'https://images.unsplash.com/photo-1564507592333/c60657eea523?w=500&h=300&fit=crop',
    popularity: 8
  },
  {
    name: 'Pink City Bazaar',
    state: 'Rajasthan',
    category: 'Cultural',
    description: 'Famous market for traditional Rajasthani handicrafts, jewelry, and textiles',
    image: 'https://images.unsplash.com/photo-1564507592333/c60657eea523?w=500&h=300&fit=crop',
    popularity: 8
  },
  {
    name: 'Johari Bazaar',
    state: 'Rajasthan',
    category: 'Cultural',
    description: 'Famous jewelry market with traditional Rajasthani gold and silver ornaments',
    image: 'https://images.unsplash.com/photo-1564507592333/c60657eea523?w=500&h=300&fit=crop',
    popularity: 7
  },
  {
    name: 'Bapu Bazaar',
    state: 'Rajasthan',
    category: 'Cultural',
    description: 'Famous textile market for traditional Rajasthani fabrics and clothing',
    image: 'https://images.unsplash.com/photo-1564507592333/c60657eea523?w=500&h=300&fit=crop',
    popularity: 7
  },
  {
    name: 'Tripolia Bazaar',
    state: 'Rajasthan',
    category: 'Cultural',
    description: 'Traditional market for brassware, copper items, and handicrafts',
    image: 'https://images.unsplash.com/photo-1564507592333/c60657eea523?w=500&h=300&fit=crop',
    popularity: 6
  },
  {
    name: 'Chandpole Bazaar',
    state: 'Rajasthan',
    category: 'Cultural',
    description: 'Famous market for traditional pottery, ceramics, and clay items',
    image: 'https://images.unsplash.com/photo-1564507592333/c60657eea523?w=500&h=300&fit=crop',
    popularity: 6
  },
  {
    name: 'Kishanpole Bazaar',
    state: 'Rajasthan',
    category: 'Cultural',
    description: 'Traditional market for wooden handicrafts and furniture',
    image: 'https://images.unsplash.com/photo-1564507592333/c60657eea523?w=500&h=300&fit=crop',
    popularity: 5
  },
  {
    name: 'Jaipur Literature Festival Venue',
    state: 'Rajasthan',
    category: 'Cultural',
    description: 'Diggi Palace - venue for the famous Jaipur Literature Festival',
    image: 'https://images.unsplash.com/photo-1564507592333/c60657eea523?w=500&h=300&fit=crop',
    popularity: 7
  },
  {
    name: 'Rambagh Palace Hotel',
    state: 'Rajasthan',
    category: 'Historical',
    description: 'Former royal residence, now a luxury hotel with beautiful gardens and architecture',
    image: 'https://images.unsplash.com/photo-1564507592333/c60657eea523?w=500&h=300&fit=crop',
    popularity: 8
  },
  {
    name: 'Chokhi Dhani Resort',
    state: 'Rajasthan',
    category: 'Cultural',
    description: 'Ethnic village resort showcasing Rajasthani culture, traditions, and cuisine',
    image: 'https://images.unsplash.com/photo-1564507592333/c60657eea523?w=500&h=300&fit=crop',
    popularity: 8
  },
  {
    name: 'Pink Square Mall',
    state: 'Rajasthan',
    category: 'Business',
    description: 'Modern shopping mall with entertainment and dining options',
    image: 'https://images.unsplash.com/photo-1564507592333/c60657eea523?w=500&h=300&fit=crop',
    popularity: 5
  },
  {
    name: 'Jaipur Metro Station',
    state: 'Rajasthan',
    category: 'Business',
    description: 'Modern metro station connecting different parts of Jaipur city',
    image: 'https://images.unsplash.com/photo-1564507592333/c60657eea523?w=500&h=300&fit=crop',
    popularity: 5
  },
  {
    name: 'Jaipur Bus Stand',
    state: 'Rajasthan',
    category: 'Business',
    description: 'Main bus terminal for intercity and interstate bus services',
    image: 'https://images.unsplash.com/photo-1564507592333/c60657eea523?w=500&h=300&fit=crop',
    popularity: 4
  },
  // Adventure Destinations
  {
    name: 'Ranthambore',
    state: 'Rajasthan',
    category: 'Adventure',
    description: 'Famous tiger reserve for wildlife safari and adventure',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop',
    popularity: 8
  },
  {
    name: 'Keoladeo National Park',
    state: 'Rajasthan',
    category: 'Adventure',
    description: 'UNESCO World Heritage bird sanctuary',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop',
    popularity: 7
  }
];

// Predefined routes with actual distances from Jaipur
const routes = [
  // From Jaipur to Religious Places
  { from: 'Jaipur', to: 'Sawariya Seth', distance: 75, estimatedDuration: 2, isPopular: true },
  { from: 'Jaipur', to: 'Khatushyamji', distance: 45, estimatedDuration: 1.5, isPopular: true },
  { from: 'Jaipur', to: 'Salasar Balaji', distance: 180, estimatedDuration: 4, isPopular: true },
  { from: 'Jaipur', to: 'Pushkar', distance: 150, estimatedDuration: 3, isPopular: true },
  { from: 'Jaipur', to: 'Ajmer Sharif', distance: 135, estimatedDuration: 2.5, isPopular: true },

  // From Jaipur to Tourist Destinations
  { from: 'Jaipur', to: 'Udaipur', distance: 380, estimatedDuration: 6, isPopular: true },
  { from: 'Jaipur', to: 'Jodhpur', distance: 340, estimatedDuration: 5.5, isPopular: true },
  { from: 'Jaipur', to: 'Jaisalmer', distance: 560, estimatedDuration: 8, isPopular: true },
  { from: 'Jaipur', to: 'Bikaner', distance: 330, estimatedDuration: 5, isPopular: true },
  { from: 'Jaipur', to: 'Mount Abu', distance: 480, estimatedDuration: 7, isPopular: true },

  // From Jaipur to Business Destinations
  { from: 'Jaipur', to: 'Delhi', distance: 280, estimatedDuration: 4.5, isPopular: true },
  { from: 'Jaipur', to: 'Mumbai', distance: 1200, estimatedDuration: 18, isPopular: true },
  { from: 'Jaipur', to: 'Bangalore', distance: 1400, estimatedDuration: 20, isPopular: true },

  // From Jaipur to Historical Places
  { from: 'Jaipur', to: 'Amer Fort', distance: 11, estimatedDuration: 0.5, isPopular: true },
  { from: 'Jaipur', to: 'Hawa Mahal', distance: 0, estimatedDuration: 0, isPopular: true },
  { from: 'Jaipur', to: 'Jantar Mantar', distance: 0, estimatedDuration: 0, isPopular: true },
  { from: 'Jaipur', to: 'City Palace', distance: 0, estimatedDuration: 0, isPopular: true },

  // From Jaipur to Small Places within City
  { from: 'Jaipur', to: 'Nahargarh Fort', distance: 8, estimatedDuration: 0.5, isPopular: true },
  { from: 'Jaipur', to: 'Jal Mahal', distance: 6, estimatedDuration: 0.3, isPopular: true },
  { from: 'Jaipur', to: 'Albert Hall Museum', distance: 2, estimatedDuration: 0.2, isPopular: true },
  { from: 'Jaipur', to: 'Birla Mandir', distance: 3, estimatedDuration: 0.2, isPopular: true },
  { from: 'Jaipur', to: 'Galtaji Temple', distance: 10, estimatedDuration: 0.5, isPopular: true },
  { from: 'Jaipur', to: 'Sisodia Rani Garden', distance: 7, estimatedDuration: 0.4, isPopular: true },
  { from: 'Jaipur', to: 'Central Park', distance: 1, estimatedDuration: 0.1, isPopular: true },
  { from: 'Jaipur', to: 'Rambagh Palace', distance: 4, estimatedDuration: 0.3, isPopular: true },
  { from: 'Jaipur', to: 'Jaipur Zoo', distance: 5, estimatedDuration: 0.3, isPopular: true },
  { from: 'Jaipur', to: 'Raj Mandir Cinema', distance: 2, estimatedDuration: 0.2, isPopular: true },
  { from: 'Jaipur', to: 'Chokhi Dhani', distance: 12, estimatedDuration: 0.6, isPopular: true },
  { from: 'Jaipur', to: 'World Trade Park', distance: 3, estimatedDuration: 0.2, isPopular: true },
  { from: 'Jaipur', to: 'Pink City Market', distance: 1, estimatedDuration: 0.1, isPopular: true },
  { from: 'Jaipur', to: 'Jaipur Railway Station', distance: 2, estimatedDuration: 0.2, isPopular: true },
  { from: 'Jaipur', to: 'Sanganer Airport', distance: 15, estimatedDuration: 0.8, isPopular: true },
  
  // Routes from Jaipur to Famous Statues and Monuments
  { from: 'Jaipur', to: 'Statue Circle', distance: 2, estimatedDuration: 0.2, isPopular: true },
  { from: 'Jaipur', to: 'Jawahar Circle', distance: 8, estimatedDuration: 0.4, isPopular: true },
  { from: 'Jaipur', to: 'Patrika Gate', distance: 8, estimatedDuration: 0.4, isPopular: true },
  { from: 'Jaipur', to: 'Ganesh Temple (Galtaji)', distance: 10, estimatedDuration: 0.5, isPopular: true },
  { from: 'Jaipur', to: 'Govind Devji Temple', distance: 1, estimatedDuration: 0.1, isPopular: true },
  { from: 'Jaipur', to: 'Laxmi Narayan Temple (Birla Mandir)', distance: 3, estimatedDuration: 0.2, isPopular: true },
  { from: 'Jaipur', to: 'Sisodia Rani Garden', distance: 7, estimatedDuration: 0.4, isPopular: true },
  { from: 'Jaipur', to: 'Vidyadhar Garden', distance: 6, estimatedDuration: 0.3, isPopular: true },
  { from: 'Jaipur', to: 'Kanak Vrindavan', distance: 5, estimatedDuration: 0.3, isPopular: true },
  { from: 'Jaipur', to: 'Jaipur Wax Museum', distance: 4, estimatedDuration: 0.2, isPopular: true },
  { from: 'Jaipur', to: 'Jawahar Kala Kendra', distance: 3, estimatedDuration: 0.2, isPopular: true },
  { from: 'Jaipur', to: 'Central Museum (Albert Hall)', distance: 2, estimatedDuration: 0.2, isPopular: true },
  { from: 'Jaipur', to: 'Pink City Bazaar', distance: 1, estimatedDuration: 0.1, isPopular: true },
  { from: 'Jaipur', to: 'Johari Bazaar', distance: 1, estimatedDuration: 0.1, isPopular: true },
  { from: 'Jaipur', to: 'Bapu Bazaar', distance: 1, estimatedDuration: 0.1, isPopular: true },
  { from: 'Jaipur', to: 'Tripolia Bazaar', distance: 1, estimatedDuration: 0.1, isPopular: true },
  { from: 'Jaipur', to: 'Chandpole Bazaar', distance: 1, estimatedDuration: 0.1, isPopular: true },
  { from: 'Jaipur', to: 'Kishanpole Bazaar', distance: 1, estimatedDuration: 0.1, isPopular: true },
  { from: 'Jaipur', to: 'Jaipur Literature Festival Venue', distance: 4, estimatedDuration: 0.2, isPopular: true },
  { from: 'Jaipur', to: 'Rambagh Palace Hotel', distance: 4, estimatedDuration: 0.3, isPopular: true },
  { from: 'Jaipur', to: 'Raj Mandir Cinema', distance: 2, estimatedDuration: 0.2, isPopular: true },
  { from: 'Jaipur', to: 'Chokhi Dhani Resort', distance: 12, estimatedDuration: 0.6, isPopular: true },
  { from: 'Jaipur', to: 'World Trade Park', distance: 3, estimatedDuration: 0.2, isPopular: true },
  { from: 'Jaipur', to: 'Pink Square Mall', distance: 5, estimatedDuration: 0.3, isPopular: true },
  { from: 'Jaipur', to: 'Jaipur Metro Station', distance: 2, estimatedDuration: 0.2, isPopular: true },
  { from: 'Jaipur', to: 'Jaipur Bus Stand', distance: 3, estimatedDuration: 0.2, isPopular: true },
  { from: 'Jaipur', to: 'Jaipur Railway Station', distance: 2, estimatedDuration: 0.2, isPopular: true },

  // From Jaipur to Adventure Destinations
  { from: 'Jaipur', to: 'Ranthambore', distance: 180, estimatedDuration: 3.5, isPopular: true },
  { from: 'Jaipur', to: 'Keoladeo National Park', distance: 180, estimatedDuration: 3.5, isPopular: true }
];

async function seedPlacesAndRoutes() {
  try {
    // Clear existing data
    await Place.deleteMany({});
    await Route.deleteMany({});
    
    console.log('Cleared existing places and routes data');

    // Insert places
    const insertedPlaces = await Place.insertMany(places);
    console.log('Places seeded successfully');

    // Create a map of place names to IDs
    const placeMap = {};
    insertedPlaces.forEach(place => {
      placeMap[place.name] = place._id;
    });

    // Insert routes with place IDs
    const routesWithIds = routes.map(route => {
      const fromPlace = placeMap[route.from];
      const toPlace = placeMap[route.to];
      
      if (!fromPlace || !toPlace) {
        console.log(`Skipping route: ${route.from} -> ${route.to} (place not found)`);
        return null;
      }
      
      return {
        from: fromPlace,
        to: toPlace,
        distance: route.distance,
        estimatedDuration: route.estimatedDuration,
        routeType: 'Direct',
        isPopular: route.isPopular,
        isActive: true
      };
    }).filter(route => route !== null);

    await Route.insertMany(routesWithIds);
    console.log('Routes seeded successfully');

    // Create additional routes for better coverage
    console.log('Creating additional routes for better coverage...');
    const additionalRoutes = [];
    
    // Create routes from each place to other popular places
    for (let i = 0; i < insertedPlaces.length; i++) {
      for (let j = 0; j < insertedPlaces.length; j++) {
        if (i !== j) {
          const fromPlace = insertedPlaces[i];
          const toPlace = insertedPlaces[j];
          
          // Check if route already exists
          const existingRoute = routesWithIds.find(route => 
            route.from.toString() === fromPlace._id.toString() && 
            route.to.toString() === toPlace._id.toString()
          );
          
          if (!existingRoute) {
            // Calculate estimated distance based on place types
            let distance = 0;
            if (fromPlace.state === toPlace.state) {
              // Same state - shorter distance
              distance = Math.floor(Math.random() * 30) + 5;
            } else {
              // Different state - longer distance
              distance = Math.floor(Math.random() * 200) + 50;
            }
            
            const estimatedDuration = Math.max(0.5, distance / 40); // Rough estimate: 40 km/h average
            
            additionalRoutes.push({
              from: fromPlace._id,
              to: toPlace._id,
              distance: distance,
              estimatedDuration: Math.round(estimatedDuration * 10) / 10,
              routeType: 'Estimated',
              isPopular: false,
              isActive: true
            });
          }
        }
      }
    }
    
    if (additionalRoutes.length > 0) {
      await Route.insertMany(additionalRoutes);
      console.log(`Additional ${additionalRoutes.length} routes created for better coverage`);
    }

    console.log('Places and Routes database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedPlacesAndRoutes();

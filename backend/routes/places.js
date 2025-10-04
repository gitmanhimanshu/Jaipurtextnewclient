const express = require('express');
const Place = require('../models/Place');
const Route = require('../models/Route');

const router = express.Router();

// Get all places
router.get('/', async (req, res) => {
  try {
    const { search, category, limit = 50 } = req.query;
    let query = { isActive: true };

    // Add search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    const places = await Place.find(query)
      .sort({ popularity: -1, name: 1 })
      .limit(parseInt(limit));

    res.json(places);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get popular places
router.get('/popular', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    const places = await Place.find({ isActive: true })
      .sort({ popularity: -1 })
      .limit(parseInt(limit));

    res.json(places);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get places by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 30 } = req.query;

    const places = await Place.find({ 
      category: category,
      isActive: true 
    })
    .sort({ popularity: -1, name: 1 })
    .limit(parseInt(limit));

    res.json(places);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json([]);
    }

    const suggestions = await Place.find({
      isActive: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { state: { $regex: q, $options: 'i' } }
      ]
    })
    .select('name state category popularity')
    .sort({ popularity: -1 })
    .limit(10);

    res.json(suggestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to find main city for a state
const findMainCityForPlace = async (place) => {
  if (!place) return null;
  
  // Define major cities for each state
  const majorCities = {
    'Rajasthan': ['Jaipur'],
    'Delhi': ['Delhi'],
    'Maharashtra': ['Mumbai'],
    'Karnataka': ['Bangalore'],
    'Uttar Pradesh': ['Lucknow'],
    'Madhya Pradesh': ['Bhopal'],
    'Gujarat': ['Ahmedabad'],
    'Tamil Nadu': ['Chennai'],
    'West Bengal': ['Kolkata'],
    'Telangana': ['Hyderabad'],
    'Andhra Pradesh': ['Amaravati'],
    'Kerala': ['Thiruvananthapuram']
  };
  
  // Check if this place is already a major city
  const stateMajorCities = majorCities[place.state] || [];
  if (stateMajorCities.includes(place.name)) {
    return place;
  }
  
  // Try to find the main city for this state
  const mainCity = await Place.findOne({
    state: place.state,
    name: { $in: stateMajorCities },
    category: { $in: ['Historical', 'Business', 'Tourist'] }
  });
  
  return mainCity;
};

// Helper function to check if a place is a specific location within a major city
const isSpecificLocationInMajorCity = async (place) => {
  if (!place) return false;
  
  // Define major cities
  const majorCities = {
    'Rajasthan': 'Jaipur',
    'Delhi': 'Delhi',
    'Maharashtra': 'Mumbai',
    'Karnataka': 'Bangalore'
  };
  
  // Check if this place is in a major city but is not the major city itself
  const majorCityName = majorCities[place.state];
  if (majorCityName && place.name !== majorCityName) {
    // Check if there's a main city entry for this state
    const mainCity = await Place.findOne({
      state: place.state,
      name: majorCityName,
      category: { $in: ['Historical', 'Business', 'Tourist'] }
    });
    
    return mainCity ? mainCity._id : null;
  }
  
  return null;
};

// Get route between two places
router.get('/route', async (req, res) => {
  try {
    const { from, to } = req.query;
    
    if (!from || !to) {
      return res.status(400).json({ message: 'From and To parameters are required' });
    }

    console.log(`Finding route from ${from} to ${to}`);

    // Get the place details
    const fromPlace = await Place.findById(from);
    const toPlace = await Place.findById(to);
    
    console.log('From place:', fromPlace ? fromPlace.name : 'Not found');
    console.log('To place:', toPlace ? toPlace.name : 'Not found');

    // Check if the "from" place is a specific location within a major city
    let effectiveFromId = from;
    const mainCityId = await isSpecificLocationInMajorCity(fromPlace);
    
    if (mainCityId) {
      console.log(`Using main city ${fromPlace.state} instead of specific location ${fromPlace.name}`);
      effectiveFromId = mainCityId;
    }

    // Find route using the effective from ID
    let route = await Route.findOne({ 
      from: effectiveFromId, 
      to: to,
      isActive: true 
    }).populate('from to');

    console.log('Route found:', route ? 'Yes' : 'No');

    if (!route) {
      // If no direct route found, try to find a city-level route as fallback
      console.log('No direct route found, trying city-level fallback');
      
      if (fromPlace && toPlace) {
        // Try to find main city for the from place
        const mainCityFrom = await findMainCityForPlace(fromPlace);
        console.log('Main city for from place:', mainCityFrom ? mainCityFrom.name : 'Not found');
        
        // Try to find main city for the to place
        const mainCityTo = await findMainCityForPlace(toPlace);
        console.log('Main city for to place:', mainCityTo ? mainCityTo.name : 'Not found');
        
        // Try different combinations to find a valid route
        if (mainCityFrom && mainCityFrom._id.toString() !== effectiveFromId) {
          // Try route from main city of origin to destination
          console.log(`Trying route from main city ${mainCityFrom.name} to ${toPlace.name}`);
          route = await Route.findOne({ 
            from: mainCityFrom._id, 
            to: to,
            isActive: true 
          }).populate('from to');
          console.log('Route from main city to destination found:', route ? 'Yes' : 'No');
        }
        
        if (!route && mainCityTo && mainCityTo._id.toString() !== to) {
          // Try route from origin to main city of destination
          console.log(`Trying route from ${fromPlace.name} to main city ${mainCityTo.name}`);
          route = await Route.findOne({ 
            from: effectiveFromId, 
            to: mainCityTo._id,
            isActive: true 
          }).populate('from to');
          console.log('Route from origin to main city found:', route ? 'Yes' : 'No');
        }
        
        if (!route && mainCityFrom && mainCityTo && 
            mainCityFrom._id.toString() !== effectiveFromId && 
            mainCityTo._id.toString() !== to) {
          // Try route from main city of origin to main city of destination
          console.log(`Trying route from main city ${mainCityFrom.name} to main city ${mainCityTo.name}`);
          route = await Route.findOne({ 
            from: mainCityFrom._id, 
            to: mainCityTo._id,
            isActive: true 
          }).populate('from to');
          console.log('Route from main city to main city found:', route ? 'Yes' : 'No');
        }
      }
    }

    if (!route) {
      console.log('No route found after all attempts');
      return res.status(404).json({ message: 'Route not found' });
    }

    console.log('Returning route with distance:', route.distance);
    res.json(route);
  } catch (error) {
    console.error('Error in route calculation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get popular routes
router.get('/popular-routes', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    const routes = await Route.find({ 
      isPopular: true,
      isActive: true 
    })
    .populate('from to')
    .sort({ popularity: -1 })
    .limit(parseInt(limit));

    res.json(routes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get available destinations from a specific place
router.get('/available-destinations', async (req, res) => {
  try {
    const { from } = req.query;
    
    if (!from) {
      return res.status(400).json({ message: 'From parameter is required' });
    }

    // First try to find specific routes from the place
    let routes = await Route.find({ 
      from: from,
      isActive: true 
    })
    .populate('to', 'name state category image popularity')
    .sort({ 'to.popularity': -1, distance: 1 });

    // If no specific routes found, get all popular destinations
    if (routes.length === 0) {
      const allPlaces = await Place.find({ 
        isActive: true,
        _id: { $ne: from } // Exclude the pickup location itself
      })
      .sort({ popularity: -1 })
      .limit(50);

      // Create destinations with estimated distances
      const destinations = allPlaces.map(place => ({
        ...place.toObject(),
        distance: Math.floor(Math.random() * 50) + 5, // Random distance between 5-55 km
        estimatedDuration: Math.floor(Math.random() * 2) + 0.5, // Random duration between 0.5-2.5 hours
        routeType: 'Estimated'
      }));

      return res.json(destinations);
    }

    // Extract unique destinations from routes
    const destinations = routes.map(route => ({
      ...route.to.toObject(),
      distance: route.distance,
      estimatedDuration: route.estimatedDuration,
      routeType: route.routeType
    }));

    res.json(destinations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
const express = require('express');
const Destination = require('../models/Destination');
const Route = require('../models/Route');

const router = express.Router();

// Get all destinations with search
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

    const destinations = await Destination.find(query)
      .sort({ popularity: -1, name: 1 })
      .limit(parseInt(limit));

    res.json(destinations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get popular destinations
router.get('/popular', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    const destinations = await Destination.find({ isActive: true })
      .sort({ popularity: -1 })
      .limit(parseInt(limit));

    res.json(destinations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get destinations by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 30 } = req.query;

    const destinations = await Destination.find({ 
      category: category,
      isActive: true 
    })
    .sort({ popularity: -1, name: 1 })
    .limit(parseInt(limit));

    res.json(destinations);
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

    const suggestions = await Destination.find({
      isActive: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { state: { $regex: q, $options: 'i' } }
      ]
    })
    .select('name state category distanceFromJaipur')
    .sort({ popularity: -1 })
    .limit(10);

    res.json(suggestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get route information
router.get('/route', async (req, res) => {
  try {
    const { from, to } = req.query;
    
    if (!from || !to) {
      return res.status(400).json({ message: 'From and To parameters are required' });
    }

    // First check if route exists in database
    let route = await Route.findOne({ 
      from: from.toLowerCase().trim(), 
      to: to.toLowerCase().trim() 
    });

    if (!route) {
      // If route doesn't exist, create a new one with estimated values
      // This is a simplified estimation - in real app, you'd use Google Maps API
      const estimatedDistance = Math.floor(Math.random() * 500) + 50; // 50-550 km
      const estimatedDuration = Math.ceil(estimatedDistance / 60); // Assuming 60 km/h average

      route = new Route({
        from: from.toLowerCase().trim(),
        to: to.toLowerCase().trim(),
        distance: estimatedDistance,
        estimatedDuration: estimatedDuration,
        routeType: 'Direct'
      });

      await route.save();
    } else {
      // Update search count and last searched
      route.searchCount += 1;
      route.lastSearched = new Date();
      await route.save();
    }

    res.json(route);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get popular routes
router.get('/popular-routes', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    const routes = await Route.find({ isPopular: true })
      .sort({ searchCount: -1 })
      .limit(parseInt(limit));

    res.json(routes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;



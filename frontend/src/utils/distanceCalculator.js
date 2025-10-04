// Free Distance Calculation Utilities
// Using Nominatim (Geocoding) + OSRM (Routing) - No API keys required

/**
 * Geocode address to coordinates using Nominatim API
 * @param {string} address - Address to geocode
 * @returns {Promise<{lat: number, lon: number}>} - Coordinates
 */
export const geocodeAddress = async (address) => {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'JaipurTaxi/1.0 (contact@jaipurtaxi.com)' // Required by Nominatim
      }
    });
    
    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.length === 0) {
      throw new Error('Address not found');
    }
    
    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
      displayName: data[0].display_name
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
};

/**
 * Calculate driving distance and duration between two coordinates using OSRM API
 * @param {number} lat1 - Start latitude
 * @param {number} lon1 - Start longitude
 * @param {number} lat2 - End latitude
 * @param {number} lon2 - End longitude
 * @returns {Promise<{distance: number, duration: number}>} - Distance in km, duration in hours
 */
export const calculateRoute = async (lat1, lon1, lat2, lon2) => {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false&steps=false`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Routing failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      throw new Error('Route not found');
    }
    
    const route = data.routes[0];
    
    return {
      distance: Math.round(route.distance / 1000 * 100) / 100, // Convert to km, round to 2 decimals
      duration: Math.round(route.duration / 3600 * 100) / 100, // Convert to hours, round to 2 decimals
      distanceMeters: route.distance,
      durationSeconds: route.duration
    };
  } catch (error) {
    console.error('Routing error:', error);
    throw error;
  }
};

/**
 * Get distance and duration between two addresses
 * @param {string} fromAddress - Starting address
 * @param {string} toAddress - Destination address
 * @returns {Promise<{distance: number, duration: number, fromCoords: object, toCoords: object}>}
 */
export const getDistanceBetweenAddresses = async (fromAddress, toAddress) => {
  try {
    // Step 1: Geocode both addresses
    const [fromCoords, toCoords] = await Promise.all([
      geocodeAddress(fromAddress),
      geocodeAddress(toAddress)
    ]);
    
    // Step 2: Calculate route
    const routeInfo = await calculateRoute(
      fromCoords.lat, fromCoords.lon,
      toCoords.lat, toCoords.lon
    );
    
    return {
      ...routeInfo,
      fromCoords,
      toCoords,
      fromAddress: fromCoords.displayName,
      toAddress: toCoords.displayName
    };
  } catch (error) {
    console.error('Distance calculation error:', error);
    throw error;
  }
};

/**
 * Get multiple route options (if needed)
 * @param {number} lat1 - Start latitude
 * @param {number} lon1 - Start longitude
 * @param {number} lat2 - End latitude
 * @param {number} lon2 - End longitude
 * @returns {Promise<Array>} - Array of route options
 */
export const getRouteAlternatives = async (lat1, lon1, lat2, lon2) => {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false&steps=false&alternatives=true`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.code !== 'Ok' || !data.routes) {
      throw new Error('Routes not found');
    }
    
    return data.routes.map(route => ({
      distance: Math.round(route.distance / 1000 * 100) / 100,
      duration: Math.round(route.duration / 3600 * 100) / 100,
      distanceMeters: route.distance,
      durationSeconds: route.duration
    }));
  } catch (error) {
    console.error('Route alternatives error:', error);
    throw error;
  }
};

/**
 * Validate if coordinates are within reasonable bounds (India)
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {boolean} - True if coordinates are valid
 */
export const validateCoordinates = (lat, lon) => {
  // India bounds (approximate)
  const minLat = 6.0;
  const maxLat = 37.0;
  const minLon = 68.0;
  const maxLon = 97.0;
  
  return lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon;
};

/**
 * Format distance for display
 * @param {number} distance - Distance in km
 * @returns {string} - Formatted distance string
 */
export const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} meters`;
  }
  return `${distance} km`;
};

/**
 * Format duration for display
 * @param {number} duration - Duration in hours
 * @returns {string} - Formatted duration string
 */
export const formatDuration = (duration) => {
  if (duration < 1) {
    return `${Math.round(duration * 60)} minutes`;
  }
  
  const hours = Math.floor(duration);
  const minutes = Math.round((duration - hours) * 60);
  
  if (hours === 0) {
    return `${minutes} minutes`;
  } else if (minutes === 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  } else {
    return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minutes`;
  }
};


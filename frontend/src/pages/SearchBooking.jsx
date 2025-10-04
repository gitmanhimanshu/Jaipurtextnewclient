import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock, Users, Car, Calendar, Star, Loader } from 'lucide-react';
import api from '../utils/api';
import { getDistanceBetweenAddresses, formatDistance, formatDuration } from '../utils/distanceCalculator';

// Debounce utility function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

const SearchBooking = () => {
  const navigate = useNavigate();
  const [from, setFrom] = useState('Jaipur');
  const [to, setTo] = useState('');
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [cars, setCars] = useState([]);
  const [liveCalculation, setLiveCalculation] = useState(null);
  const [isCalculatingLive, setIsCalculatingLive] = useState(false);

  // Debounced live calculation function
  const debouncedLiveCalculation = useCallback(
    debounce(async (fromAddress, toAddress) => {
      if (!fromAddress || !toAddress || fromAddress === toAddress) {
        setLiveCalculation(null);
        return;
      }

      setIsCalculatingLive(true);
      try {
        const data = await getDistanceBetweenAddresses(fromAddress, toAddress);
        setLiveCalculation({
          distance: data.distance,
          duration: data.duration,
          fromAddress: data.fromAddress,
          toAddress: data.toAddress
        });
      } catch (err) {
        console.error('Live calculation error:', err);
        setLiveCalculation(null);
      } finally {
        setIsCalculatingLive(false);
      }
    }, 1000), // 1 second delay
    []
  );

  // Live calculation effect
  useEffect(() => {
    if (from && to && from !== to) {
      debouncedLiveCalculation(from, to);
    } else {
      setLiveCalculation(null);
    }
  }, [from, to, debouncedLiveCalculation]);

  useEffect(() => {
    fetchPopularDestinations();
    fetchCars();
  }, []);

  const fetchPopularDestinations = async () => {
    try {
      const response = await api.get('/api/destinations/popular?limit=10');
      setPopularDestinations(response.data);
    } catch (err) {
      console.error('Error fetching popular destinations:', err);
    }
  };

  const fetchCars = async () => {
    try {
      const response = await api.get('/api/cars');
      setCars(response.data);
    } catch (err) {
      console.error('Error fetching cars:', err);
    }
  };

  const handleFromSearch = async (query) => {
    if (query.length < 2) {
      setFromSuggestions([]);
      setShowFromSuggestions(false);
      return;
    }

    try {
      const response = await api.get(`/api/destinations/suggestions?q=${query}`);
      setFromSuggestions(response.data);
      setShowFromSuggestions(true);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
    }
  };

  const handleToSearch = async (query) => {
    if (query.length < 2) {
      setToSuggestions([]);
      setShowToSuggestions(false);
      return;
    }

    try {
      const response = await api.get(`/api/destinations/suggestions?q=${query}`);
      setToSuggestions(response.data);
      setShowToSuggestions(true);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
    }
  };

  const handleFromSelect = (destination) => {
    setFrom(destination.name);
    setShowFromSuggestions(false);
  };

  const handleToSelect = (destination) => {
    setTo(destination.name);
    setShowToSuggestions(false);
    if (from && destination.name) {
      fetchRouteInfo(from, destination.name);
    }
  };

  const fetchRouteInfo = async (fromCity, toCity) => {
    setLoading(true);
    setError('');
    
    try {
      // Use real distance calculation with Nominatim + OSRM
      const routeData = await getDistanceBetweenAddresses(fromCity, toCity);
      
      setRouteInfo({
        distance: routeData.distance,
        estimatedDuration: routeData.duration,
        routeType: 'Direct',
        fromCoords: routeData.fromCoords,
        toCoords: routeData.toCoords,
        fromAddress: routeData.fromAddress,
        toAddress: routeData.toAddress
      });
    } catch (err) {
      setError(`Failed to calculate route: ${err.message}`);
      console.error('Error calculating route:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!from || !to) {
      setError('Please select both from and to destinations');
      return;
    }
    
    if (from === to) {
      setError('From and To destinations cannot be the same');
      return;
    }

    fetchRouteInfo(from, to);
  };

  const handleBookNow = (car) => {
    const currentRouteInfo = routeInfo || liveCalculation;
    if (!currentRouteInfo) {
      setError('Please search for a route first');
      return;
    }

    // Navigate to booking page with route and car information
    navigate(`/booking/custom?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&carId=${car._id}&distance=${currentRouteInfo.distance}&duration=${currentRouteInfo.duration}`);
  };

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Search & Book Your Journey</h1>
        
        {/* Search Form */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Where do you want to go?</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            {/* From Input */}
            <div style={{ position: 'relative' }}>
              <label className="form-label">From</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="input"
                  value={from}
                  onChange={(e) => {
                    setFrom(e.target.value);
                    handleFromSearch(e.target.value);
                  }}
                  onFocus={() => setShowFromSuggestions(true)}
                  placeholder="Enter departure city"
                />
                <MapPin size={20} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
              </div>
              
              {showFromSuggestions && fromSuggestions.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  zIndex: 10,
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  {fromSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '0.75rem',
                        cursor: 'pointer',
                        borderBottom: '1px solid #f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                      onClick={() => handleFromSelect(suggestion)}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    >
                      <MapPin size={16} style={{ color: '#3b82f6' }} />
                      <div>
                        <div style={{ fontWeight: '500' }}>{suggestion.name}</div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {suggestion.state} • {suggestion.distanceFromJaipur}km from Jaipur
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* To Input */}
            <div style={{ position: 'relative' }}>
              <label className="form-label">To</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="input"
                  value={to}
                  onChange={(e) => {
                    setTo(e.target.value);
                    handleToSearch(e.target.value);
                  }}
                  onFocus={() => setShowToSuggestions(true)}
                  placeholder="Enter destination city"
                />
                <MapPin size={20} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
              </div>
              
              {showToSuggestions && toSuggestions.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  zIndex: 10,
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  {toSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '0.75rem',
                        cursor: 'pointer',
                        borderBottom: '1px solid #f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                      onClick={() => handleToSelect(suggestion)}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    >
                      <MapPin size={16} style={{ color: '#3b82f6' }} />
                      <div>
                        <div style={{ fontWeight: '500' }}>{suggestion.name}</div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {suggestion.state} • {suggestion.distanceFromJaipur}km from Jaipur
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>
          )}

          <button 
            className="btn btn-primary" 
            onClick={handleSearch}
            disabled={loading}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            {loading ? (
              <>
                <Loader size={16} className="animate-spin" />
                Calculating Route...
              </>
            ) : (
              <>
                <Search size={16} />
                Search Route
              </>
            )}
          </button>
        </div>

        {/* Live Distance Calculation */}
        {(liveCalculation || isCalculatingLive) && (
          <div className="card" style={{ marginBottom: '2rem', border: '2px solid #10b981' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', color: '#10b981' }}>
              <Loader size={20} style={{ marginRight: '0.5rem' }} className={isCalculatingLive ? 'animate-spin' : ''} />
              Live Distance Calculation
            </h3>
            
            {isCalculatingLive ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem' }}>
                <Loader size={16} className="animate-spin" />
                <span>Calculating distance...</span>
              </div>
            ) : liveCalculation ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={16} style={{ color: '#10b981' }} />
                    <span><strong>Distance:</strong> {formatDistance(liveCalculation.distance)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={16} style={{ color: '#10b981' }} />
                    <span><strong>Duration:</strong> {formatDuration(liveCalculation.duration)}</span>
                  </div>
                </div>
                
                <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <MapPin size={16} style={{ color: '#10b981' }} />
                    <span style={{ fontWeight: '500' }}>Live Route:</span>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    <div><strong>From:</strong> {liveCalculation.fromAddress}</div>
                    <div><strong>To:</strong> {liveCalculation.toAddress}</div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        )}

        {/* Route Information */}
        {routeInfo && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
              <MapPin size={20} style={{ marginRight: '0.5rem', color: '#3b82f6' }} />
              Route Information
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} style={{ color: '#6b7280' }} />
                <span><strong>Distance:</strong> {formatDistance(routeInfo.distance)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} style={{ color: '#6b7280' }} />
                <span><strong>Duration:</strong> {formatDuration(routeInfo.estimatedDuration)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Car size={16} style={{ color: '#6b7280' }} />
                <span><strong>Route Type:</strong> {routeInfo.routeType}</span>
              </div>
            </div>
            
            {routeInfo.fromAddress && routeInfo.toAddress && (
              <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <MapPin size={16} style={{ color: '#3b82f6' }} />
                  <span style={{ fontWeight: '500' }}>Route Details:</span>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  <div><strong>From:</strong> {routeInfo.fromAddress}</div>
                  <div><strong>To:</strong> {routeInfo.toAddress}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Popular Destinations */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
            <Star size={20} style={{ marginRight: '0.5rem', color: '#3b82f6' }} />
            Popular Destinations
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {popularDestinations.map((destination) => (
              <div 
                key={destination._id}
                className="card" 
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => {
                  setTo(destination.name);
                  fetchRouteInfo(from, destination.name);
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <MapPin size={16} style={{ color: '#3b82f6' }} />
                  <h4 style={{ margin: 0 }}>{destination.name}</h4>
                </div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  {destination.state} • {destination.distanceFromJaipur}km
                </p>
                <p style={{ fontSize: '0.875rem', color: '#374151' }}>{destination.description}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
                  <Star size={14} style={{ color: '#f59e0b' }} />
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Popularity: {destination.popularity}/10
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Car Selection */}
        {(routeInfo || liveCalculation) && cars.length > 0 && (
          <div className="card">
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
              <Car size={20} style={{ marginRight: '0.5rem', color: '#3b82f6' }} />
              Select Your Vehicle
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              {cars.map((car) => (
                <div 
                  key={car._id}
                  className={`card ${selectedCar?._id === car._id ? 'border-primary' : ''}`}
                  style={{ 
                    cursor: 'pointer', 
                    transition: 'all 0.2s',
                    border: selectedCar?._id === car._id ? '2px solid #3b82f6' : '1px solid #e5e7eb'
                  }}
                  onClick={() => setSelectedCar(car)}
                >
                  {car.image && (
                    <div style={{ marginBottom: '1rem' }}>
                      <img 
                        src={car.image} 
                        alt={car.name}
                        style={{ 
                          width: '100%', 
                          height: '150px', 
                          objectFit: 'cover', 
                          borderRadius: '0.5rem' 
                        }}
                      />
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <Car size={20} style={{ color: '#3b82f6', marginRight: '0.5rem' }} />
                    <h4 style={{ margin: 0 }}>{car.name}</h4>
                  </div>
                  
                  <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>{car.description}</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Users size={16} style={{ color: '#6b7280' }} />
                      <span style={{ fontSize: '0.875rem' }}>{car.capacity} passengers</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>₹{car.pricePerKm}/km</span>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Estimated Cost: ₹{Math.round(car.pricePerKm * (routeInfo?.distance || liveCalculation?.distance || 0))}</strong>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                      For {(routeInfo?.distance || liveCalculation?.distance || 0)}km journey
                    </p>
                  </div>
                  
                  <button 
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    onClick={() => handleBookNow(car)}
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBooking;


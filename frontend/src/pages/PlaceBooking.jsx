import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calculator, Shield, MapPin, Clock, Users, Phone, Calendar, Navigation, Car } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import LiveTracking from '../components/LiveTracking';
import DriverPanel from '../components/DriverPanel';
import Toast from '../components/Toast';

// Debounce utility function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

const PlaceBooking = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [selectedTo, setSelectedTo] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [availableDestinations, setAvailableDestinations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [toSearchQuery, setToSearchQuery] = useState('');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [isSearchingFrom, setIsSearchingFrom] = useState(false);
  const [isSearchingTo, setIsSearchingTo] = useState(false);
  const [formData, setFormData] = useState({
    pickupDate: '',
    pickupTime: '',
    passengers: 1,
    contactNumber: user?.phone || ''
  });
  const [showLiveTracking, setShowLiveTracking] = useState(false);
  const [showDriverPanel, setShowDriverPanel] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  useEffect(() => {
    fetchItem();
    fetchPlaces();
  }, [type, id]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.form-group')) {
        setShowFromDropdown(false);
        setShowToDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchItem = async () => {
    try {
      const endpoint = type === 'car' ? `/api/cars/${id}` : `/api/tours/${id}`;
      const response = await api.get(endpoint);
      setItem(response.data);
    } catch (err) {
      setError('Failed to load item details');
      console.error('Error fetching item:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaces = async () => {
    try {
      const response = await api.get('/api/places/popular?limit=50');
      // Sort places to show specific Jaipur locations first, then general Jaipur
      const sortedPlaces = response.data.sort((a, b) => {
        // If both are in Rajasthan, prioritize specific locations over general Jaipur
        if (a.state === 'Rajasthan' && b.state === 'Rajasthan') {
          if (a.name === 'Jaipur' && b.name !== 'Jaipur') return 1;
          if (b.name === 'Jaipur' && a.name !== 'Jaipur') return -1;
        }
        return b.popularity - a.popularity;
      });
      setPlaces(sortedPlaces);
    } catch (err) {
      console.error('Error fetching places:', err);
    }
  };

  const fetchAvailableDestinations = async (fromId) => {
    try {
      const response = await api.get(`/api/places/available-destinations?from=${fromId}`);
      setAvailableDestinations(response.data);
    } catch (err) {
      console.error('Error fetching available destinations:', err);
    }
  };

  const searchPlaces = async (query) => {
    if (query.length < 2) return [];
    try {
      const response = await api.get(`/api/places/suggestions?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (err) {
      console.error('Error searching places:', err);
      return [];
    }
  };

  const handleFromSearch = async (query) => {
    if (query.length < 2) {
      setFromSuggestions([]);
      setShowFromDropdown(false);
      return;
    }

    setIsSearchingFrom(true);
    try {
      const suggestions = await searchPlaces(query);
      setFromSuggestions(suggestions);
      setShowFromDropdown(true);
    } catch (err) {
      console.error('Error searching from places:', err);
    } finally {
      setIsSearchingFrom(false);
    }
  };

  const handleToSearch = async (query) => {
    if (query.length < 2) {
      setToSuggestions([]);
      setShowToDropdown(false);
      return;
    }

    setIsSearchingTo(true);
    try {
      const suggestions = await searchPlaces(query);
      setToSuggestions(suggestions);
      setShowToDropdown(true);
    } catch (err) {
      console.error('Error searching to places:', err);
    } finally {
      setIsSearchingTo(false);
    }
  };

  // Debounced search functions
  const debouncedFromSearch = useCallback(
    debounce(handleFromSearch, 300),
    []
  );

  const debouncedToSearch = useCallback(
    debounce(handleToSearch, 300),
    []
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFromSelect = (place) => {
    setSelectedFrom(place);
    setSearchQuery(place.name);
    setShowFromDropdown(false);
    setSelectedTo(null);
    setRouteInfo(null);
    setError(''); // Clear previous errors
    
    // Always fetch available destinations, even for Jaipur
    fetchAvailableDestinations(place._id);
  };

  const handleToSelect = (place) => {
    setSelectedTo(place);
    setToSearchQuery(place.name);
    setShowToDropdown(false);
    if (selectedFrom) {
      fetchRouteInfo(selectedFrom._id, place._id);
    }
  };

  const fetchRouteInfo = async (fromId, toId) => {
    try {
      const response = await api.get(`/api/places/route?from=${fromId}&to=${toId}`);
      setRouteInfo(response.data);
    } catch (err) {
      console.error('Error fetching route info:', err);
      setRouteInfo(null);
    }
  };

  const calculateAmount = () => {
    if (!item || !routeInfo) return 0;
    
    if (type === 'car') {
      return Math.round(item.pricePerKm * routeInfo.distance);
    } else {
      return Math.round(routeInfo.distance * 15); // ₹15 per km for tours
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    console.log('Booking form submitted:', {
      selectedFrom,
      selectedTo,
      routeInfo,
      formData,
      item,
      type,
      id
    });

    if (!selectedFrom || !selectedTo) {
      setError('Please select both pickup and drop locations');
      setSubmitting(false);
      return;
    }

    if (!routeInfo) {
      setError('Route information not available');
      setSubmitting(false);
      return;
    }

    if (!formData.pickupDate || !formData.pickupTime || !formData.contactNumber) {
      setError('Please fill in all required fields (Date, Time, Contact Number)');
      setSubmitting(false);
      return;
    }

    try {
      const bookingData = {
        type,
        [type + 'Id']: id,
        pickupLocation: selectedFrom.name,
        dropLocation: selectedTo.name,
        pickupDate: formData.pickupDate,
        pickupTime: formData.pickupTime,
        passengers: formData.passengers,
        contactNumber: formData.contactNumber,
        distance: routeInfo.distance,
        duration: routeInfo.estimatedDuration,
        totalAmount: calculateAmount()
      };

      console.log('Sending booking data:', bookingData);

      const response = await api.post('/api/bookings', bookingData);
      console.log('Booking created successfully:', response.data);
      
      // Set booking ID for live tracking
      setBookingId(response.data._id || response.data.id);
      
      // Show success message with toast
      setError('');
      setToast({
        message: 'Booking created successfully! You can now track your driver live.',
        type: 'success'
      });
    } catch (err) {
      console.error('Booking error:', err);
      const message = err.response?.data?.message || err.message || 'Booking failed';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem 0' }}>
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is admin - admins cannot create bookings
  if (user?.role === 'admin') {
    return (
      <div style={{ padding: '2rem 0' }}>
        <div className="container">
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <Shield size={64} style={{ color: '#f59e0b', marginBottom: '1rem' }} />
            <h2 style={{ color: '#374151', marginBottom: '1rem' }}>Admin Access Restricted</h2>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              As an admin, you can only approve or reject bookings. You cannot create new bookings.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                onClick={() => navigate('/admin')}
                className="btn btn-primary"
              >
                Go to Admin Dashboard
              </button>
              <button 
                onClick={() => navigate(-1)}
                className="btn btn-outline"
              >
                <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} />
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !item) {
    return (
      <div style={{ padding: '2rem 0' }}>
        <div className="container">
          <div className="alert alert-error">{error}</div>
          <button onClick={() => navigate(-1)} className="btn btn-outline">
            <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 0', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      
      <div className="container" style={{ maxWidth: '1200px' }}>
        <div style={{ maxWidth: '100%', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h1 style={{ marginBottom: '0.5rem', color: '#1f2937' }}>Book Your Journey</h1>
            <p style={{ color: '#6b7280' }}>Select your pickup and drop locations</p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '1.5rem',
            alignItems: 'start'
          }}
          className="booking-grid"
          >
            {/* Left Side - Item Details & Route Info */}
            <div className="card" style={{ height: 'fit-content' }}>
              <h2 style={{ marginBottom: '1rem', color: '#1f2937' }}>Vehicle Details</h2>
              
              {type === 'car' ? (
                <div>
                  <h3 style={{ marginBottom: '0.5rem', color: '#374151' }}>{item?.name}</h3>
                  <p style={{ color: '#10b981', fontWeight: '600', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                    ₹{item?.pricePerKm} per km
                  </p>
                  <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{item?.description}</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Users size={16} style={{ color: '#6b7280' }} />
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      Capacity: {item?.capacity} passengers
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      Type: {item?.type}
                    </span>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 style={{ marginBottom: '0.5rem', color: '#374151' }}>{item?.name}</h3>
                  <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                    {item?.from} → {item?.to}
                  </p>
                  <p style={{ color: '#374151', marginBottom: '1rem' }}>{item?.description}</p>
                  <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                    Duration: {item?.duration?.hours} hours | Distance: {item?.distance} km
                  </p>
                </div>
              )}

              {/* Route Information & Cost Calculation */}
              {selectedFrom && selectedTo && routeInfo && (
                <div style={{ 
                  marginTop: '2rem', 
                  padding: '1.5rem', 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '0.75rem', 
                  border: '1px solid #e5e7eb'
                }}>
                  <h3 style={{ marginBottom: '1rem', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={20} style={{ color: '#3b82f6' }} />
                    Route Details
                  </h3>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ color: '#6b7280' }}>From:</span>
                      <span style={{ fontWeight: '500', color: '#374151' }}>{selectedFrom.name}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ color: '#6b7280' }}>To:</span>
                      <span style={{ fontWeight: '500', color: '#374151' }}>{selectedTo.name}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ color: '#6b7280' }}>Distance:</span>
                      <span style={{ fontWeight: '500', color: '#10b981' }}>{routeInfo.distance} km</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <span style={{ color: '#6b7280' }}>Duration:</span>
                      <span style={{ fontWeight: '500', color: '#10b981' }}>{routeInfo.estimatedDuration} hours</span>
                    </div>
                  </div>

                  <div style={{ 
                    padding: '1rem', 
                    backgroundColor: '#f0fdf4', 
                    borderRadius: '0.5rem', 
                    border: '1px solid #bbf7d0'
                  }}>
                    <h4 style={{ marginBottom: '0.75rem', color: '#1f2937' }}>Cost Calculation</h4>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ color: '#6b7280' }}>Rate per km:</span>
                      <span style={{ fontWeight: '500' }}>₹{type === 'car' ? item?.pricePerKm : 15}</span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{ color: '#6b7280' }}>Distance:</span>
                      <span style={{ fontWeight: '500' }}>{routeInfo.distance} km</span>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '0.75rem',
                      backgroundColor: 'white',
                      borderRadius: '0.5rem',
                      border: '1px solid #e5e7eb'
                    }}>
                      <span style={{ fontWeight: '600', color: '#1f2937', fontSize: '1.1rem' }}>Total Amount:</span>
                      <span style={{ color: '#10b981', fontSize: '1.5rem', fontWeight: '700' }}>₹{calculateAmount()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Live Cost Calculation */}
              {selectedFrom && selectedTo && routeInfo && (
                <div style={{ 
                  marginTop: '1.5rem', 
                  padding: '1.5rem', 
                  backgroundColor: '#f0fdf4', 
                  borderRadius: '0.75rem', 
                  border: '2px solid #10b981'
                }}>
                  <h3 style={{ marginBottom: '1rem', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calculator size={20} style={{ color: '#10b981' }} />
                    Live Cost Calculation
                  </h3>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ color: '#6b7280' }}>Distance:</span>
                      <span style={{ fontWeight: '500', color: '#374151' }}>{routeInfo.distance} km</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ color: '#6b7280' }}>Rate per km:</span>
                      <span style={{ fontWeight: '500', color: '#374151' }}>₹{type === 'car' ? item?.pricePerKm : 15}</span>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '1rem',
                      backgroundColor: 'white',
                      borderRadius: '0.5rem',
                      border: '1px solid #e5e7eb',
                      marginTop: '1rem'
                    }}>
                      <span style={{ fontWeight: '600', color: '#1f2937', fontSize: '1.2rem' }}>Total Amount:</span>
                      <span style={{ color: '#10b981', fontSize: '1.8rem', fontWeight: '700' }}>₹{calculateAmount()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Show available destinations count */}
              {selectedFrom && availableDestinations.length > 0 && (
                <div style={{ 
                  marginTop: '1.5rem', 
                  padding: '1rem', 
                  backgroundColor: '#f0f9ff', 
                  borderRadius: '0.5rem', 
                  border: '1px solid #e0f2fe'
                }}>
                  <h4 style={{ marginBottom: '0.5rem', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={16} style={{ color: '#3b82f6' }} />
                    Available Destinations
                  </h4>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                    {availableDestinations.length} destinations available from {selectedFrom.name}
                  </p>
                </div>
              )}
            </div>

            {/* Right Side - Booking Form */}
            <div className="card" style={{ 
              backgroundColor: 'white', 
              minHeight: '600px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h3 style={{ marginBottom: '1.5rem', color: '#1f2937', fontSize: '1.5rem' }}>Select Your Route</h3>
              
              {error && (
                <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>
              )}

              <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* From Location */}
                <div className="form-group" style={{ marginBottom: '2rem' }}>
                  <label className="form-label" style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>Pickup Location</label>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    color: '#6b7280', 
                    marginBottom: '0.75rem',
                    padding: '0.75rem',
                    backgroundColor: '#f0f9ff',
                    borderRadius: '0.5rem',
                    border: '1px solid #e0f2fe'
                  }}>
                    💡 Search for pickup location (e.g., Jaipur, Hawa Mahal, City Palace, Amer Fort)
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="input"
                      placeholder="Search specific pickup location (e.g., Hawa Mahal, City Palace)"
                      value={selectedFrom?.name || searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        debouncedFromSearch(e.target.value);
                      }}
                      onFocus={() => setShowFromDropdown(true)}
                      style={{ 
                        cursor: 'pointer',
                        padding: '1rem',
                        fontSize: '1rem',
                        width: '100%'
                      }}
                    />
                    <MapPin size={20} style={{ 
                      position: 'absolute', 
                      right: '1rem', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      color: '#6b7280',
                      pointerEvents: 'none'
                    }} />
                  </div>
                  
                  {showFromDropdown && (
                    <div style={{ 
                      position: 'absolute',
                      zIndex: 10,
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      maxHeight: '300px',
                      overflowY: 'auto',
                      width: '100%',
                      marginTop: '0.25rem'
                    }}>
                      {/* Show loading indicator */}
                      {isSearchingFrom && (
                        <div style={{ 
                          padding: '1rem', 
                          textAlign: 'center', 
                          color: '#6b7280',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem'
                        }}>
                          <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                          Searching places...
                        </div>
                      )}
                      
                      {/* Show search suggestions */}
                      {!isSearchingFrom && fromSuggestions.length > 0 && (
                        <>
                          {/* Show Jaipur city locations first if searching for Jaipur */}
                          {searchQuery.toLowerCase().includes('jaipur') && (
                            <div style={{ 
                              padding: '0.75rem', 
                              backgroundColor: '#f0f9ff', 
                              borderBottom: '1px solid #e0f2fe',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              color: '#1e40af'
                            }}>
                              🏛️ Popular locations within Jaipur city:
                            </div>
                          )}
                          
                          {fromSuggestions.map((place) => (
                            <div
                              key={place._id}
                              style={{
                                padding: '0.75rem',
                                cursor: 'pointer',
                                borderBottom: '1px solid #f3f4f6',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                backgroundColor: place.state === 'Rajasthan' && place.name !== 'Jaipur' && searchQuery.toLowerCase().includes('jaipur') ? '#f8fafc' : 'white'
                              }}
                              onClick={() => {
                                handleFromSelect(place);
                                setSearchQuery('');
                              }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#e0f2fe'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = place.state === 'Rajasthan' && place.name !== 'Jaipur' && searchQuery.toLowerCase().includes('jaipur') ? '#f8fafc' : 'white'}
                            >
                              <MapPin size={16} style={{ color: place.state === 'Rajasthan' && place.name !== 'Jaipur' ? '#10b981' : '#3b82f6' }} />
                              <div>
                                <div style={{ fontWeight: '500' }}>{place.name}</div>
                                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                  {place.state} • {place.category}
                                </div>
                              </div>
                              {place.state === 'Rajasthan' && place.name !== 'Jaipur' && (
                                <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '500' }}>
                                  In Jaipur
                                </div>
                              )}
                            </div>
                          ))}
                        </>
                      )}
                      
                      {/* Show no results message */}
                      {!isSearchingFrom && fromSuggestions.length === 0 && searchQuery.length >= 2 && (
                        <div style={{ 
                          padding: '1rem', 
                          textAlign: 'center', 
                          color: '#6b7280' 
                        }}>
                          No places found for "{searchQuery}"
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* To Location */}
                <div className="form-group" style={{ marginBottom: '2rem' }}>
                  <label className="form-label" style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>Drop Location</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="input"
                      placeholder={selectedFrom ? "Search drop location" : "First select pickup location"}
                      value={selectedTo?.name || toSearchQuery}
                      readOnly={!selectedFrom}
                      onChange={(e) => {
                        if (selectedFrom) {
                          setToSearchQuery(e.target.value);
                          debouncedToSearch(e.target.value);
                        }
                      }}
                      onFocus={() => selectedFrom && setShowToDropdown(true)}
                      style={{ 
                        cursor: selectedFrom ? 'pointer' : 'not-allowed',
                        backgroundColor: selectedFrom ? 'white' : '#f9fafb',
                        padding: '1rem',
                        fontSize: '1rem',
                        width: '100%'
                      }}
                    />
                    <MapPin size={20} style={{ 
                      position: 'absolute', 
                      right: '1rem', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      color: selectedFrom ? '#6b7280' : '#d1d5db',
                      pointerEvents: 'none'
                    }} />
                  </div>
                  
                  {showToDropdown && selectedFrom && (
                    <div style={{ 
                      position: 'absolute',
                      zIndex: 10,
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      maxHeight: '300px',
                      overflowY: 'auto',
                      width: '100%',
                      marginTop: '0.25rem'
                    }}>
                      {/* Show loading indicator */}
                      {isSearchingTo && (
                        <div style={{ 
                          padding: '1rem', 
                          textAlign: 'center', 
                          color: '#6b7280',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem'
                        }}>
                          <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                          Searching destinations...
                        </div>
                      )}
                      
                      {/* Show search suggestions if user is typing */}
                      {!isSearchingTo && toSearchQuery.length >= 2 && toSuggestions.length > 0 && (
                        <>
                          <div style={{ 
                            padding: '0.75rem', 
                            backgroundColor: '#f0f9ff', 
                            borderBottom: '1px solid #e0f2fe',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#1e40af'
                          }}>
                            🔍 Search Results:
                          </div>
                          
                          {toSuggestions.map((place) => (
                            <div
                              key={place._id}
                              style={{
                                padding: '0.75rem',
                                cursor: 'pointer',
                                borderBottom: '1px solid #f3f4f6',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                              }}
                              onClick={() => handleToSelect(place)}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                            >
                              <MapPin size={16} style={{ color: '#3b82f6' }} />
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '500' }}>{place.name}</div>
                                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                  {place.state} • {place.category}
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                      
                      {/* Show available destinations if no search query */}
                      {!isSearchingTo && toSearchQuery.length < 2 && availableDestinations.length > 0 && (
                        <>
                          <div style={{ 
                            padding: '0.75rem', 
                            backgroundColor: '#f0fdf4', 
                            borderBottom: '1px solid #bbf7d0',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#1f2937'
                          }}>
                            📍 Popular destinations from {selectedFrom.name}:
                          </div>
                          
                          {availableDestinations.map((destination) => (
                            <div
                              key={destination._id}
                              style={{
                                padding: '0.75rem',
                                cursor: 'pointer',
                                borderBottom: '1px solid #f3f4f6',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                              }}
                              onClick={() => handleToSelect(destination)}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                            >
                              <MapPin size={16} style={{ color: '#10b981' }} />
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '500' }}>{destination.name}</div>
                                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                  {destination.state} • {destination.category}
                                </div>
                              </div>
                              <div style={{ textAlign: 'right', fontSize: '0.875rem', color: '#10b981' }}>
                                <div style={{ fontWeight: '500' }}>{destination.distance} km</div>
                                <div style={{ color: '#6b7280' }}>{destination.estimatedDuration}h</div>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                      
                      {/* Show no results message */}
                      {!isSearchingTo && toSearchQuery.length >= 2 && toSuggestions.length === 0 && (
                        <div style={{ 
                          padding: '1rem', 
                          textAlign: 'center', 
                          color: '#6b7280' 
                        }}>
                          No destinations found for "{toSearchQuery}"
                        </div>
                      )}
                      
                      {/* Show no destinations message */}
                      {!isSearchingTo && toSearchQuery.length < 2 && availableDestinations.length === 0 && (
                        <div style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>
                          No destinations available from {selectedFrom.name}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Available Destinations */}
                {selectedFrom && availableDestinations.length > 0 && !selectedTo && (
                  <div style={{ 
                    backgroundColor: '#f0fdf4', 
                    padding: '1rem', 
                    borderRadius: '0.5rem', 
                    marginBottom: '1.5rem',
                    border: '1px solid #bbf7d0'
                  }}>
                    <h4 style={{ marginBottom: '0.75rem', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={16} style={{ color: '#10b981' }} />
                      Popular Destinations from {selectedFrom.name}
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }} className="destinations-grid">
                      {availableDestinations.slice(0, 6).map((destination) => (
                        <div
                          key={destination._id}
                          style={{
                            padding: '0.75rem',
                            backgroundColor: 'white',
                            borderRadius: '0.5rem',
                            border: '1px solid #e5e7eb',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onClick={() => handleToSelect(destination)}
                          onMouseEnter={(e) => {
                            e.target.style.borderColor = '#10b981';
                            e.target.style.boxShadow = '0 2px 4px rgba(16, 185, 129, 0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.borderColor = '#e5e7eb';
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>{destination.name}</div>
                          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                            {destination.state} • {destination.category}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.875rem', color: '#10b981', fontWeight: '500' }}>
                              {destination.distance} km
                            </span>
                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                              {destination.estimatedDuration}h
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {availableDestinations.length > 6 && (
                      <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
                        <button
                          type="button"
                          onClick={() => setShowToDropdown(true)}
                          style={{
                            background: 'none',
                            border: '1px solid #10b981',
                            color: '#10b981',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem'
                          }}
                        >
                          View All {availableDestinations.length} Destinations
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Route Information */}
                {routeInfo && (
                  <div style={{ 
                    backgroundColor: '#f0f9ff', 
                    padding: '1rem', 
                    borderRadius: '0.5rem', 
                    marginBottom: '1.5rem',
                    border: '1px solid #e0f2fe'
                  }}>
                    <h4 style={{ marginBottom: '0.5rem', color: '#1f2937' }}>Route Information</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ color: '#6b7280' }}>Distance:</span>
                      <span style={{ fontWeight: '500' }}>{routeInfo.distance} km</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280' }}>Duration:</span>
                      <span style={{ fontWeight: '500' }}>{routeInfo.estimatedDuration} hours</span>
                    </div>
                  </div>
                )}

                {/* Form Fields Grid */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '1.5rem',
                  marginBottom: '2rem'
                }}
                className="form-fields-grid"
                >
                  {/* Date Input */}
                  <div className="form-group">
                    <label htmlFor="pickupDate" className="form-label" style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>Date</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="date"
                        id="pickupDate"
                        name="pickupDate"
                        value={formData.pickupDate}
                        onChange={handleChange}
                        className="input"
                        style={{ 
                          padding: '0.875rem 3rem 0.875rem 1rem',
                          fontSize: '0.9rem',
                          width: '100%'
                        }}
                        required
                      />
                      <Calendar size={18} style={{ 
                        position: 'absolute', 
                        right: '1rem', 
                        top: '50%', 
                        transform: 'translateY(-50%)', 
                        color: '#6b7280',
                        pointerEvents: 'none'
                      }} />
                    </div>
                  </div>

                  {/* Pickup Time Input */}
                  <div className="form-group">
                    <label htmlFor="pickupTime" className="form-label" style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>Time</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="time"
                        id="pickupTime"
                        name="pickupTime"
                        value={formData.pickupTime}
                        onChange={handleChange}
                        className="input"
                        style={{ 
                          padding: '0.875rem 3rem 0.875rem 1rem',
                          fontSize: '0.9rem',
                          width: '100%'
                        }}
                        required
                      />
                      <Clock size={18} style={{ 
                        position: 'absolute', 
                        right: '1rem', 
                        top: '50%', 
                        transform: 'translateY(-50%)', 
                        color: '#6b7280',
                        pointerEvents: 'none'
                      }} />
                    </div>
                  </div>

                  {/* Number of Passengers */}
                  <div className="form-group">
                    <label htmlFor="passengers" className="form-label" style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>Passengers</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        id="passengers"
                        name="passengers"
                        value={formData.passengers}
                        onChange={handleChange}
                        className="input"
                        style={{ 
                          padding: '0.875rem 3rem 0.875rem 1rem',
                          fontSize: '0.9rem',
                          width: '100%'
                        }}
                        min="1"
                        max={type === 'car' ? (item?.capacity || 8) : 8}
                        required
                      />
                      <Users size={18} style={{ 
                        position: 'absolute', 
                        right: '1rem', 
                        top: '50%', 
                        transform: 'translateY(-50%)', 
                        color: '#6b7280',
                        pointerEvents: 'none'
                      }} />
                    </div>
                  </div>

                  {/* Contact Number */}
                  <div className="form-group">
                    <label htmlFor="contactNumber" className="form-label" style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>Contact</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="tel"
                        id="contactNumber"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        className="input"
                        style={{ 
                          padding: '0.875rem 3rem 0.875rem 1rem',
                          fontSize: '0.9rem',
                          width: '100%'
                        }}
                        placeholder="Your phone number"
                        required
                      />
                      <Phone size={18} style={{ 
                        position: 'absolute', 
                        right: '1rem', 
                        top: '50%', 
                        transform: 'translateY(-50%)', 
                        color: '#6b7280',
                        pointerEvents: 'none'
                      }} />
                    </div>
                  </div>
                </div>

                {/* Estimated Cost Section */}
                {routeInfo && (
                  <div style={{ 
                    backgroundColor: '#f8fafc', 
                    padding: '1.5rem', 
                    borderRadius: '0.75rem', 
                    marginBottom: '2rem',
                    border: '1px solid #e5e7eb'
                  }}>
                    <h4 style={{ marginBottom: '1rem', color: '#1f2937' }}>Estimated Cost</h4>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ color: '#6b7280' }}>Estimated Distance:</span>
                      <span style={{ fontWeight: '500', color: '#374151' }}>{routeInfo.distance} km</span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ fontWeight: '600', color: '#1f2937' }}>Total Amount:</span>
                      <span style={{ color: '#10b981', fontSize: '1.5rem', fontWeight: '700' }}>₹{calculateAmount()}</span>
                    </div>
                    
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.75rem 0 0 0', fontStyle: 'italic' }}>
                      *Final amount may vary based on actual distance and route
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ 
                  display: 'flex', 
                  gap: '1rem', 
                  marginTop: 'auto',
                  paddingTop: '2rem'
                }}
                className="action-buttons"
                >
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting || !selectedFrom || !selectedTo || !routeInfo}
                    style={{ 
                      flex: 1,
                      padding: '1rem 1.5rem',
                      fontSize: '1rem',
                      fontWeight: '600',
                      borderRadius: '0.75rem',
                      minHeight: '3rem'
                    }}
                  >
                    {submitting ? 'Booking...' : 'Confirm Booking'}
                  </button>

                  <button 
                    type="button"
                    onClick={() => navigate(-1)}
                    className="btn btn-outline"
                    style={{ 
                      flex: 1,
                      padding: '1rem 1.5rem',
                      fontSize: '1rem',
                      fontWeight: '500',
                      borderRadius: '0.75rem',
                      minHeight: '3rem'
                    }}
                  >
                    <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} />
                    Go Back
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Live Tracking Buttons */}
      {bookingId && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          display: 'flex',
          gap: '10px',
          zIndex: 1000
        }}>
          <button
            onClick={() => setShowLiveTracking(true)}
            style={{
              background: '#27ae60',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '25px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(39, 174, 96, 0.3)'
            }}
          >
            <Navigation size={16} />
            Track Driver
          </button>
        </div>
      )}

      {/* Driver Panel Button */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 1000
      }}>
        <button
          onClick={() => setShowDriverPanel(true)}
          style={{
            background: '#e74c3c',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '25px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(231, 76, 60, 0.3)'
          }}
        >
          <Car size={16} />
          Driver GPS
        </button>
      </div>

      {/* Live Tracking Modal */}
      {showLiveTracking && (
        <LiveTracking
          bookingId={bookingId}
          onClose={() => setShowLiveTracking(false)}
        />
      )}

      {/* Driver Panel Modal */}
      {showDriverPanel && (
        <DriverPanel
          onClose={() => setShowDriverPanel(false)}
        />
      )}
    </div>
  );
};

export default PlaceBooking;


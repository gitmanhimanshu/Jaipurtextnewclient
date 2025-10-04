import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calculator, Shield } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Booking = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropLocation: '',
    pickupDate: '',
    pickupTime: '',
    passengers: 1,
    contactNumber: ''
  });

  useEffect(() => {
    fetchItem();
  }, [type, id]);

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateDistance = () => {
    // For demo purposes, we'll use a random distance between 10-100 km
    // In a real app, you'd use a mapping service like Google Maps API
    return Math.floor(Math.random() * 90) + 10;
  };

  const calculateAmount = () => {
    if (!item) return 0;
    
    if (type === 'car') {
      const distance = calculateDistance();
      return item.pricePerKm * distance;
    } else {
      // Tour pricing - fixed amount based on distance
      return calculateDistance() * 15; // ₹15 per km for tours
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const bookingData = {
        type,
        [type + 'Id']: id,
        ...formData,
        distance: calculateDistance(),
        totalAmount: calculateAmount()
      };

      await api.post('/api/bookings', bookingData);
      navigate('/my-bookings');
    } catch (err) {
      const message = err.response?.data?.message || 'Booking failed';
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
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        <div className="grid grid-2">
          <div className="card">
            <h2 style={{ marginBottom: '1rem' }}>Booking Details</h2>
            
            {type === 'car' ? (
              <div>
                <h3>{item.name}</h3>
                <p style={{ color: '#10b981', fontWeight: '600', fontSize: '1.25rem' }}>
                  ₹{item.pricePerKm} per km
                </p>
                <p style={{ color: '#6b7280' }}>{item.description}</p>
              </div>
            ) : (
              <div>
                <h3>{item.name}</h3>
                <p style={{ color: '#6b7280' }}>
                  {item.from} → {item.to}
                </p>
                <p style={{ color: '#374151' }}>{item.description}</p>
                <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                  Duration: {item.duration.hours} hours | Distance: {item.distance} km
                </p>
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
              <Calculator size={20} style={{ marginRight: '0.5rem' }} />
              Booking Form
            </h3>
            
            {error && (
              <div className="alert alert-error">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="pickupLocation" className="form-label">Pickup Location</label>
                <input
                  type="text"
                  id="pickupLocation"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter pickup address"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="dropLocation" className="form-label">Drop Location</label>
                <input
                  type="text"
                  id="dropLocation"
                  name="dropLocation"
                  value={formData.dropLocation}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter drop address"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="pickupDate" className="form-label">Pickup Date</label>
                <input
                  type="date"
                  id="pickupDate"
                  name="pickupDate"
                  value={formData.pickupDate}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="pickupTime" className="form-label">Pickup Time</label>
                <input
                  type="time"
                  id="pickupTime"
                  name="pickupTime"
                  value={formData.pickupTime}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="passengers" className="form-label">Number of Passengers</label>
                <input
                  type="number"
                  id="passengers"
                  name="passengers"
                  value={formData.passengers}
                  onChange={handleChange}
                  className="input"
                  min="1"
                  max={type === 'car' ? item.capacity : 8}
                  required
              />
              </div>

              <div className="form-group">
                <label htmlFor="contactNumber" className="form-label">Contact Number</label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter your contact number"
                  required
              />
              </div>

              <div className="card" style={{ backgroundColor: '#f8fafc', marginBottom: '1rem' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>Estimated Cost</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Estimated Distance:</span>
                  <span>{calculateDistance()} km</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', marginTop: '0.5rem' }}>
                  <span>Total Amount:</span>
                  <span style={{ color: '#10b981', fontSize: '1.25rem' }}>₹{calculateAmount()}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}>
                  *Final amount may vary based on actual distance and route
                </p>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
                style={{ width: '100%' }}
              >
                {submitting ? 'Booking...' : 'Confirm Booking'}
              </button>
            </form>

            <button 
              onClick={() => navigate(-1)}
              className="btn btn-outline"
              style={{ width: '100%', marginTop: '1rem' }}
            >
              <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
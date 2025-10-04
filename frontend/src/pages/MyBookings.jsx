import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Car, Navigation } from 'lucide-react';
import api from '../utils/api';
import LiveTracking from '../components/LiveTracking';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLiveTracking, setShowLiveTracking] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [selectedCarId, setSelectedCarId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/api/bookings/my-bookings');
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-success';
      case 'rejected': return 'text-danger';
      case 'completed': return 'text-success';
      default: return 'text-warning';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const formatTime = (timeString) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLiveTracking = (bookingId, carId = null) => {
    setSelectedBookingId(bookingId);
    setSelectedCarId(carId);
    setShowLiveTracking(true);
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

  if (error) {
    return (
      <div style={{ padding: '2rem 0' }}>
        <div className="container">
          <div className="alert alert-error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bookings-container">
      <div className="container">
        <div className="bookings-header">
          <h1>My Bookings</h1>
          <p>Track and manage your taxi bookings</p>
        </div>
        
        {bookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Calendar size={64} />
            </div>
            <h3>No bookings found</h3>
            <p>You haven't made any bookings yet. Start by booking a car or tour!</p>
            <div className="empty-actions">
              <a href="/cars" className="btn btn-primary">Book a Car</a>
              <a href="/tours" className="btn btn-outline">View Tours</a>
            </div>
          </div>
        ) : (
          <div className="bookings-grid">
            {bookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                <div className="booking-header">
                  <div className="booking-title">
                    <div className="booking-icon">
                      {booking.type === 'car' ? (
                        <Car size={24} />
                      ) : (
                        <Navigation size={24} />
                      )}
                    </div>
                    <div>
                      <h3>
                        {booking.type === 'car' ? booking.car?.name : booking.tour?.name}
                      </h3>
                      <p className="booking-type">
                        {booking.type === 'car' ? 'Car Rental' : 'Tour Package'}
                      </p>
                    </div>
                  </div>
                  <div className="booking-status">
                    <span className={`status-badge status-${booking.status}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                    <div className="booking-price">
                      ₹{booking.totalAmount}
                    </div>
                  </div>
                </div>

                <div className="booking-details">
                  <div className="detail-item">
                    <MapPin size={16} />
                    <span>{booking.pickupLocation} → {booking.dropLocation}</span>
                  </div>
                  
                  <div className="detail-item">
                    <Calendar size={16} />
                    <span>{formatDate(booking.pickupDate)} at {formatTime(booking.pickupTime)}</span>
                  </div>
                  
                  <div className="detail-item">
                    <Users size={16} />
                    <span>{booking.passengers} passenger{booking.passengers > 1 ? 's' : ''}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span>Distance: {booking.distance} km</span>
                  </div>
                  
                  {/* Show car ID for car bookings */}
                  {booking.type === 'car' && booking.car && (
                    <div className="detail-item">
                      <span>Car ID: {booking.car._id}</span>
                    </div>
                  )}
                </div>

                {booking.adminNotes && (
                  <div className="admin-notes">
                    <p><strong>Admin Note:</strong> {booking.adminNotes}</p>
                  </div>
                )}

                <div className="booking-footer">
                  <div className="booking-id">
                    ID: {booking._id.slice(-8)}
                  </div>
                  <div className="booking-date">
                    Booked: {formatDate(booking.createdAt)}
                  </div>
                </div>

                {/* Live Tracking Button */}
                {booking.status === 'approved' && (
                  <div className="booking-actions" style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #e9ecef' }}>
                    <button
                      onClick={() => handleLiveTracking(booking._id, booking.type === 'car' ? booking.car._id : null)}
                      style={{
                        background: '#27ae60',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        width: '100%',
                        justifyContent: 'center'
                      }}
                    >
                      <Navigation size={16} />
                      Track Driver Live
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Live Tracking Modal */}
      {showLiveTracking && (
        <LiveTracking
          bookingId={selectedBookingId}
          carId={selectedCarId}
          onClose={() => {
            setShowLiveTracking(false);
            setSelectedBookingId(null);
            setSelectedCarId(null);
          }}
        />
      )}
    </div>
  );
};

export default MyBookings;
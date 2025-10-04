import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Users, Star } from 'lucide-react';
import api from '../utils/api';

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const response = await api.get('/api/tours');
      setTours(response.data);
    } catch (err) {
      setError('Failed to load tours');
      console.error('Error fetching tours:', err);
    } finally {
      setLoading(false);
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
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Popular Tours</h1>
        
        <div className="grid grid-2">
          {tours.map((tour) => (
            <div key={tour._id} className="card">
              {tour.image && (
                <div style={{ marginBottom: '1rem' }}>
                  <img 
                    src={tour.image} 
                    alt={tour.name}
                    style={{ 
                      width: '100%', 
                      height: '200px', 
                      objectFit: 'cover', 
                      borderRadius: '0.5rem' 
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <MapPin size={20} style={{ color: '#3b82f6', marginRight: '0.5rem' }} />
                  <h3>{tour.name}</h3>
                </div>
                
                <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                  {tour.from} → {tour.to}
                </p>
                
                <p style={{ color: '#374151' }}>{tour.description}</p>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <MapPin size={16} style={{ color: '#6b7280', marginRight: '0.5rem' }} />
                  <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                    Distance: {tour.distance} km
                  </span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <Clock size={16} style={{ color: '#6b7280', marginRight: '0.5rem' }} />
                  <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                    Duration: {tour.duration.hours} hours
                  </span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <Users size={16} style={{ color: '#6b7280', marginRight: '0.5rem' }} />
                  <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                    Perfect for group tours
                  </span>
                </div>
              </div>

              {tour.highlights && tour.highlights.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <Star size={16} style={{ color: '#6b7280', marginRight: '0.5rem' }} />
                    <span style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '500' }}>
                      Highlights:
                    </span>
                  </div>
                  <div style={{ paddingLeft: '1.5rem' }}>
                    {tour.highlights.map((highlight, index) => (
                      <span key={index} style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                        • {highlight}
                        {index < tour.highlights.length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <Link 
                to={`/booking/tour/${tour._id}`}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Book This Tour - ₹{tour.distance * 15}
              </Link>
            </div>
          ))}
        </div>

        {tours.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <MapPin size={64} style={{ color: '#d1d5db', marginBottom: '1rem' }} />
            <h3 style={{ color: '#6b7280' }}>No tours available</h3>
            <p style={{ color: '#9ca3af' }}>Please check back later for available tours.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tours;
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Car, Users, Zap } from 'lucide-react';
import api from '../utils/api';

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await api.get('/api/cars');
      setCars(response.data);
    } catch (err) {
      setError('Failed to load cars');
      console.error('Error fetching cars:', err);
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
        <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Our Car Fleet</h1>
        
        <div className="grid grid-3">
          {cars.map((car) => (
            <div key={car._id} className="card">
              {car.image && (
                <div style={{ marginBottom: '1rem' }}>
                  <img 
                    src={car.image} 
                    alt={car.name}
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
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <Car size={32} style={{ color: '#3b82f6', marginRight: '0.5rem' }} />
                <div>
                  <h3>{car.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0' }}>Car ID: {car._id}</p>
                </div>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>
                  ₹{car.pricePerKm} per km
                </p>
                <p style={{ color: '#6b7280' }}>{car.description}</p>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <Users size={16} style={{ color: '#6b7280', marginRight: '0.5rem' }} />
                  <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                    Capacity: {car.capacity} passengers
                  </span>
                </div>
                
                {car.features && (
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <Zap size={16} style={{ color: '#6b7280', marginRight: '0.5rem' }} />
                    <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                      Features: {car.features.join(', ')}
                    </span>
                  </div>
                )}
              </div>

              <Link 
                to={`/booking/car/${car._id}`}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Book This Car
              </Link>
            </div>
          ))}
        </div>

        {cars.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <Car size={64} style={{ color: '#d1d5db', marginBottom: '1rem' }} />
            <h3 style={{ color: '#6b7280' }}>No cars available</h3>
            <p style={{ color: '#9ca3af' }}>Please check back later for available vehicles.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cars;

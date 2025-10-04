import { useState } from 'react';
import { Search, Car, Navigation } from 'lucide-react';
import LiveTracking from './LiveTracking';

const CarTracker = () => {
  const [carId, setCarId] = useState('');
  const [showLiveTracking, setShowLiveTracking] = useState(false);
  const [error, setError] = useState('');

  const handleTrackCar = (e) => {
    e.preventDefault();
    
    if (!carId.trim()) {
      setError('Please enter a valid Car ID');
      return;
    }
    
    setError('');
    setShowLiveTracking(true);
  };

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Car size={48} style={{ color: '#3b82f6', marginBottom: '1rem' }} />
          <h2>Track Car by ID</h2>
          <p>Enter your car ID to track its live location</p>
        </div>
        
        {!showLiveTracking ? (
          <form onSubmit={handleTrackCar}>
            <div className="form-group">
              <label htmlFor="carId" className="form-label">Car ID</label>
              <input
                type="text"
                id="carId"
                value={carId}
                onChange={(e) => setCarId(e.target.value)}
                className="input"
                placeholder="Enter Car ID"
                style={{ fontSize: '16px', padding: '12px' }}
              />
              {error && <div className="alert alert-error" style={{ marginTop: '0.5rem' }}>{error}</div>}
            </div>
            
            <button
              type="submit"
              className="btn btn-primary"
              style={{ 
                width: '100%', 
                padding: '12px', 
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Search size={20} />
              Track Car
            </button>
            
            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1rem', 
              backgroundColor: '#f8fafc', 
              borderRadius: '8px',
              fontSize: '14px'
            }}>
              <h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>How to find your Car ID:</h4>
              <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                <li>Check your booking confirmation email</li>
                <li>Look in the "My Bookings" section</li>
                <li>Car ID is displayed on your booking details</li>
              </ul>
            </div>
          </form>
        ) : (
          <div>
            <button
              onClick={() => setShowLiveTracking(false)}
              className="btn btn-outline"
              style={{ marginBottom: '1rem' }}
            >
              ← Back to Search
            </button>
            <LiveTracking 
              carId={carId}
              onClose={() => setShowLiveTracking(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CarTracker;
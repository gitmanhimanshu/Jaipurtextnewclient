import { useState, useEffect, useCallback } from 'react';
import { MapPin, Clock, Car, Search, Loader } from 'lucide-react';
import { getDistanceBetweenAddresses, formatDistance, formatDuration } from '../utils/distanceCalculator';

// Debounce utility function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

const DistanceCalculatorDemo = () => {
  const [from, setFrom] = useState('Jaipur');
  const [to, setTo] = useState('Delhi');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [liveResult, setLiveResult] = useState(null);
  const [isCalculatingLive, setIsCalculatingLive] = useState(false);

  // Debounced live calculation function
  const debouncedLiveCalculation = useCallback(
    debounce(async (fromAddress, toAddress) => {
      if (!fromAddress || !toAddress || fromAddress === toAddress) {
        setLiveResult(null);
        return;
      }

      setIsCalculatingLive(true);
      try {
        const data = await getDistanceBetweenAddresses(fromAddress, toAddress);
        setLiveResult({
          distance: data.distance,
          duration: data.duration,
          fromAddress: data.fromAddress,
          toAddress: data.toAddress
        });
      } catch (err) {
        console.error('Live calculation error:', err);
        setLiveResult(null);
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
      setLiveResult(null);
    }
  }, [from, to, debouncedLiveCalculation]);

  const calculateDistance = async () => {
    if (!from || !to) {
      setError('Please enter both from and to addresses');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await getDistanceBetweenAddresses(from, to);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>
          🚗 Free Distance Calculator Demo
        </h1>
        
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Calculate Real Distance</h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            Using <strong>Nominatim</strong> (Geocoding) + <strong>OSRM</strong> (Routing) - No API keys required!
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label className="form-label">From Address</label>
              <input
                type="text"
                className="input"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="e.g., Jaipur, Delhi, Mumbai"
              />
            </div>
            <div>
              <label className="form-label">To Address</label>
              <input
                type="text"
                className="input"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="e.g., Delhi, Mumbai, Bangalore"
              />
            </div>
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>
          )}

          <button 
            className="btn btn-primary" 
            onClick={calculateDistance}
            disabled={loading}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            {loading ? (
              <>
                <Loader size={16} className="animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <Search size={16} />
                Calculate Distance
              </>
            )}
          </button>
        </div>

        {/* Live Distance Calculation */}
        {(liveResult || isCalculatingLive) && (
          <div className="card" style={{ marginBottom: '2rem', border: '2px solid #10b981' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', color: '#10b981' }}>
              <Loader size={20} style={{ marginRight: '0.5rem' }} className={isCalculatingLive ? 'animate-spin' : ''} />
              🔴 Live Distance Calculation (Auto-updates as you type!)
            </h3>
            
            {isCalculatingLive ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem' }}>
                <Loader size={16} className="animate-spin" />
                <span>Calculating distance...</span>
              </div>
            ) : liveResult ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={16} style={{ color: '#10b981' }} />
                    <span><strong>Distance:</strong> {formatDistance(liveResult.distance)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={16} style={{ color: '#10b981' }} />
                    <span><strong>Duration:</strong> {formatDuration(liveResult.duration)}</span>
                  </div>
                </div>
                
                <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <MapPin size={16} style={{ color: '#10b981' }} />
                    <span style={{ fontWeight: '500' }}>Live Route:</span>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    <div><strong>From:</strong> {liveResult.fromAddress}</div>
                    <div><strong>To:</strong> {liveResult.toAddress}</div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        )}

        {result && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
              <MapPin size={20} style={{ marginRight: '0.5rem', color: '#3b82f6' }} />
              Route Information
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} style={{ color: '#6b7280' }} />
                <span><strong>Distance:</strong> {formatDistance(result.distance)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} style={{ color: '#6b7280' }} />
                <span><strong>Duration:</strong> {formatDuration(result.duration)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Car size={16} style={{ color: '#6b7280' }} />
                <span><strong>Route Type:</strong> Driving</span>
              </div>
            </div>
            
            <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <MapPin size={16} style={{ color: '#3b82f6' }} />
                <span style={{ fontWeight: '500' }}>Address Details:</span>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                <div><strong>From:</strong> {result.fromAddress}</div>
                <div><strong>To:</strong> {result.toAddress}</div>
              </div>
            </div>

            <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Car size={16} style={{ color: '#3b82f6' }} />
                <span style={{ fontWeight: '500' }}>Coordinates:</span>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                <div><strong>From:</strong> {result.fromCoords.lat.toFixed(6)}, {result.fromCoords.lon.toFixed(6)}</div>
                <div><strong>To:</strong> {result.toCoords.lat.toFixed(6)}, {result.toCoords.lon.toFixed(6)}</div>
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>🔧 How It Works</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
              <h4 style={{ marginBottom: '0.5rem', color: '#3b82f6' }}>1. Geocoding</h4>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Uses <strong>Nominatim API</strong> to convert addresses to coordinates (lat/lon)
              </p>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
              <h4 style={{ marginBottom: '0.5rem', color: '#3b82f6' }}>2. Routing</h4>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Uses <strong>OSRM API</strong> to calculate driving distance and travel time
              </p>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
              <h4 style={{ marginBottom: '0.5rem', color: '#3b82f6' }}>3. Free & Open</h4>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                No API keys required! Uses OpenStreetMap data completely free
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistanceCalculatorDemo;

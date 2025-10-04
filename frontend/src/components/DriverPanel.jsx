import { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Car, Users, Phone, Wifi, WifiOff } from 'lucide-react';

const DriverPanel = ({ onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [driverData, setDriverData] = useState({
    driverId: '',
    driverName: '',
    vehicleId: '',
    bookingId: ''
  });
  const [currentLocation, setCurrentLocation] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const [map, setMap] = useState(null);
  const [driverMarker, setDriverMarker] = useState(null);
  const mapRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    initializeMap();
    connectToTracking();
    
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const initializeMap = () => {
    // Load Leaflet dynamically
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet/dist/leaflet.js';
    script.onload = () => {
      const L = window.L;
      
      if (mapRef.current && !map) {
        const newMap = L.map(mapRef.current).setView([26.9124, 75.7873], 12);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(newMap);
        
        setMap(newMap);
      }
    };
    document.head.appendChild(script);

    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet/dist/leaflet.css';
    document.head.appendChild(link);
  };

  const connectToTracking = () => {
    // Load Socket.IO dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.socket.io/4.6.1/socket.io.min.js';
    script.onload = () => {
      const io = window.io;
      const socket = io('http://localhost:3001');
      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('Connected to tracking server');
        setIsConnected(true);
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from tracking server');
        setIsConnected(false);
      });
    };
    document.head.appendChild(script);
  };

  const startTracking = () => {
    if (!driverData.driverId || !driverData.driverName || !driverData.vehicleId) {
      alert('Please fill in all required fields');
      return;
    }

    if (isTracking) {
      stopTracking();
      return;
    }

    // Join as driver
    socketRef.current?.emit('driver:join', {
      vehicle_id: driverData.vehicleId,
      driver_id: driverData.driverId,
      driver_name: driverData.driverName
    });

    // Start GPS tracking
    if ('geolocation' in navigator) {
      const options = {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000
      };

      const id = navigator.geolocation.watchPosition(
        sendLocation,
        handleLocationError,
        options
      );

      setWatchId(id);
      setIsTracking(true);
    } else {
      alert('Geolocation not supported by this browser');
    }
  };

  const stopTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
  };

  const sendLocation = (position) => {
    const data = {
      vehicle_id: driverData.vehicleId,
      driver_id: driverData.driverId,
      lat: position.coords.latitude,
      lon: position.coords.longitude,
      accuracy: position.coords.accuracy,
      ts: new Date().toISOString()
    };

    if (driverData.bookingId) {
      data.booking_id = driverData.bookingId;
    }

    socketRef.current?.emit('location:update', data);
    setCurrentLocation(data);
    updateDriverMarker(data);
  };

  const handleLocationError = (error) => {
    let message = 'Unknown error occurred';
    
    switch(error.code) {
      case error.PERMISSION_DENIED:
        message = 'Location access denied by user';
        break;
      case error.POSITION_UNAVAILABLE:
        message = 'Location information unavailable';
        break;
      case error.TIMEOUT:
        message = 'Location request timed out';
        break;
    }
    
    alert(`GPS Error: ${message}`);
    stopTracking();
  };

  const updateDriverMarker = (data) => {
    if (!map) return;

    const { lat, lon } = data;

    if (driverMarker) {
      driverMarker.setLatLng([lat, lon]);
    } else {
      const L = window.L;
      const marker = L.marker([lat, lon], {
        icon: L.divIcon({
          className: 'driver-marker',
          html: '<div style="background: #e74c3c; color: white; border-radius: 50%; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-size: 14px;">🚗</div>',
          iconSize: [25, 25],
          iconAnchor: [12, 12]
        })
      }).addTo(map);

      marker.bindPopup(`
        <strong>🚗 Your Location</strong><br>
        Driver: ${driverData.driverName}<br>
        Vehicle: ${driverData.vehicleId}<br>
        Location: ${lat.toFixed(6)}, ${lon.toFixed(6)}<br>
        Time: ${new Date().toLocaleTimeString()}
      `);

      setDriverMarker(marker);
      map.setView([lat, lon], 15);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'white',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ margin: 0, fontSize: '20px' }}>🚗 Driver GPS Panel</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: isConnected ? '#27ae60' : '#e74c3c'
          }}></div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ display: 'flex', flex: 1, height: 'calc(100vh - 70px)' }}>
        {/* Map */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
          
          {/* Map Controls */}
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 1000,
            background: 'white',
            borderRadius: '8px',
            padding: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <button
              onClick={() => map?.setView([26.9124, 75.7873], 12)}
              style={{
                background: '#667eea',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                marginRight: '5px'
              }}
            >
              📍 Jaipur
            </button>
            <button
              onClick={() => {
                if (driverMarker) {
                  map?.setView(driverMarker.getLatLng(), 15);
                  driverMarker.openPopup();
                }
              }}
              style={{
                background: '#667eea',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              🔍 My Location
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{
          width: '350px',
          backgroundColor: 'white',
          borderLeft: '1px solid #e1e5e9',
          overflowY: 'auto',
          padding: '20px'
        }}>
          {/* Driver Info Form */}
          <div style={{
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>🚗 Driver Information</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Driver ID *
              </label>
              <input
                type="text"
                value={driverData.driverId}
                onChange={(e) => setDriverData({...driverData, driverId: e.target.value})}
                placeholder="Enter your driver ID"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Driver Name *
              </label>
              <input
                type="text"
                value={driverData.driverName}
                onChange={(e) => setDriverData({...driverData, driverName: e.target.value})}
                placeholder="Enter your name"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Vehicle ID (Car ID) *
              </label>
              <input
                type="text"
                value={driverData.vehicleId}
                onChange={(e) => setDriverData({...driverData, vehicleId: e.target.value})}
                placeholder="Enter vehicle ID"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Booking ID (Optional)
              </label>
              <input
                type="text"
                value={driverData.bookingId}
                onChange={(e) => setDriverData({...driverData, bookingId: e.target.value})}
                placeholder="Enter booking ID if tracking specific trip"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
              />
            </div>

            <button
              onClick={startTracking}
              disabled={!isConnected}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: isTracking ? '#e74c3c' : '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isConnected ? 'pointer' : 'not-allowed',
                opacity: isConnected ? 1 : 0.5
              }}
            >
              {isTracking ? 'Stop GPS Tracking' : 'Start GPS Tracking'}
            </button>
          </div>

          {/* Current Location */}
          {currentLocation && (
            <div style={{
              backgroundColor: '#f8f9fa',
              border: '1px solid #e9ecef',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>📍 Current Location</h3>
              <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#6c757d' }}>Latitude:</span>
                  <span style={{ fontWeight: '600', color: '#2c3e50' }}>
                    {currentLocation.lat?.toFixed(6) || '--'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#6c757d' }}>Longitude:</span>
                  <span style={{ fontWeight: '600', color: '#2c3e50' }}>
                    {currentLocation.lon?.toFixed(6) || '--'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#6c757d' }}>Accuracy:</span>
                  <span style={{ fontWeight: '600', color: '#2c3e50' }}>
                    {Math.round(currentLocation.accuracy || 0)} meters
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6c757d' }}>Last Update:</span>
                  <span style={{ fontWeight: '600', color: '#2c3e50' }}>
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Status */}
          <div style={{
            backgroundColor: isTracking ? '#d4edda' : '#f8d7da',
            border: `1px solid ${isTracking ? '#c3e6cb' : '#f5c6cb'}`,
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '10px'
            }}>
              {isTracking ? <Wifi size={20} color="#27ae60" /> : <WifiOff size={20} color="#e74c3c" />}
              <span style={{
                fontWeight: '600',
                color: isTracking ? '#155724' : '#721c24'
              }}>
                {isTracking ? 'GPS Tracking Active' : 'GPS Tracking Inactive'}
              </span>
            </div>
            <div style={{
              fontSize: '14px',
              color: isTracking ? '#155724' : '#721c24'
            }}>
              {isTracking 
                ? 'Your location is being shared in real-time'
                : 'Click "Start GPS Tracking" to begin sharing your location'
              }
            </div>
          </div>

          {/* Instructions */}
          <div style={{
            backgroundColor: '#e9ecef',
            borderRadius: '8px',
            padding: '15px',
            fontSize: '14px',
            color: '#6c757d'
          }}>
            <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>💡 Instructions</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>Fill in your driver information</li>
              <li>Enter your Vehicle ID (Car ID) exactly as registered</li>
              <li>Click "Start GPS Tracking" to begin</li>
              <li>Allow location access when prompted</li>
              <li>Your location will be shared in real-time</li>
              <li>Customers can track your car using the Car ID</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverPanel;
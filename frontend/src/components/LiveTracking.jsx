import { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Clock, Users, Phone, Car } from 'lucide-react';

const LiveTracking = ({ bookingId, carId, onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [driverLocation, setDriverLocation] = useState(null);
  const [driverInfo, setDriverInfo] = useState(null);
  const [bookingStatus, setBookingStatus] = useState('searching');
  const [map, setMap] = useState(null);
  const [driverMarker, setDriverMarker] = useState(null);
  const [customerMarker, setCustomerMarker] = useState(null);
  const mapRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    initializeMap();
    connectToTracking();
    
    return () => {
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
        
        // Join as customer to track specific booking or car
        if (carId) {
          socket.emit('customer:join:car', {
            car_id: carId,
            customer_id: 'customer_' + Date.now()
          });
        } else {
          socket.emit('customer:join', {
            booking_id: bookingId,
            customer_id: 'customer_' + Date.now()
          });
        }
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from tracking server');
        setIsConnected(false);
      });

      socket.on('booking:status', (data) => {
        console.log('Booking status received:', data);
        setDriverInfo(data);
        setBookingStatus(data.status || 'searching');
      });
      
      socket.on('booking:notfound', (data) => {
        console.log('Booking not found for car:', data);
        setBookingStatus('notfound');
      });

      socket.on('location:live', (data) => {
        // For booking tracking
        if (bookingId && data.booking_id === bookingId) {
          console.log('Driver location update:', data);
          setDriverLocation(data);
          updateDriverMarker(data);
        }
        // For car tracking
        else if (carId && data.vehicle_id === carId) {
          console.log('Driver location update for car:', data);
          setDriverLocation(data);
          updateDriverMarker(data);
        }
      });

      socket.on('booking:accepted', (data) => {
        if ((bookingId && data.booking_id === bookingId) || (carId && data.vehicle_id === carId)) {
          setBookingStatus('accepted');
        }
      });

      socket.on('trip:started', (data) => {
        if ((bookingId && data.booking_id === bookingId) || (carId && data.vehicle_id === carId)) {
          setBookingStatus('started');
        }
      });

      socket.on('trip:completed', (data) => {
        if ((bookingId && data.booking_id === bookingId) || (carId && data.vehicle_id === carId)) {
          setBookingStatus('completed');
        }
      });
    };
    document.head.appendChild(script);
  };

  const updateDriverMarker = (data) => {
    if (!map) return;

    const { lat, lon, driver_id, vehicle_id } = data;

    if (driverMarker) {
      driverMarker.setLatLng([lat, lon]);
      driverMarker.setPopupContent(`
        <strong>🚗 Your Driver</strong><br>
        Driver: ${driver_id}<br>
        Vehicle: ${vehicle_id}<br>
        Location: ${lat.toFixed(6)}, ${lon.toFixed(6)}<br>
        Time: ${new Date().toLocaleTimeString()}
      `);
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
        <strong>🚗 Your Driver</strong><br>
        Driver: ${driver_id}<br>
        Vehicle: ${vehicle_id}<br>
        Location: ${lat.toFixed(6)}, ${lon.toFixed(6)}<br>
        Time: ${new Date().toLocaleTimeString()}
      `);

      setDriverMarker(marker);
      map.setView([lat, lon], 15);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'searching': return '#f39c12';
      case 'accepted': return '#3498db';
      case 'started': return '#e74c3c';
      case 'completed': return '#27ae60';
      case 'notfound': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'searching': return 'Searching for driver...';
      case 'accepted': return 'Driver accepted your booking';
      case 'started': return 'Driver is on the way';
      case 'completed': return 'Trip completed';
      case 'notfound': return 'No active booking found for this car';
      default: return 'Unknown status';
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
        <h2 style={{ margin: 0, fontSize: '20px' }}>🚗 Live Tracking</h2>
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
              🔍 Find Driver
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
          {/* Booking Status */}
          <div style={{
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>📋 Booking Status</h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '10px'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: getStatusColor(bookingStatus)
              }}></div>
              <span style={{ fontWeight: '600', color: '#2c3e50' }}>
                {getStatusText(bookingStatus)}
              </span>
            </div>
            <div style={{ fontSize: '14px', color: '#6c757d' }}>
              {bookingId ? `Booking ID: ${bookingId}` : `Car ID: ${carId || '--'}`}
            </div>
          </div>

          {/* Driver Info */}
          {driverInfo && (
            <div style={{
              backgroundColor: '#f8f9fa',
              border: '1px solid #e9ecef',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>🚗 Driver Details</h3>
              <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#6c757d' }}>Driver ID:</span>
                  <span style={{ fontWeight: '600', color: '#2c3e50' }}>{driverInfo.driver_id || '--'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#6c757d' }}>Vehicle:</span>
                  <span style={{ fontWeight: '600', color: '#2c3e50' }}>{driverInfo.vehicle_id || '--'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6c757d' }}>Status:</span>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor: getStatusColor(bookingStatus) + '20',
                    color: getStatusColor(bookingStatus)
                  }}>
                    {bookingStatus.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Live Location */}
          {driverLocation && (
            <div style={{
              backgroundColor: '#f8f9fa',
              border: '1px solid #e9ecef',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>📍 Live Location</h3>
              <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#6c757d' }}>Latitude:</span>
                  <span style={{ fontWeight: '600', color: '#2c3e50' }}>
                    {driverLocation.lat?.toFixed(6) || '--'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#6c757d' }}>Longitude:</span>
                  <span style={{ fontWeight: '600', color: '#2c3e50' }}>
                    {driverLocation.lon?.toFixed(6) || '--'}
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

          {/* Instructions */}
          <div style={{
            backgroundColor: '#e9ecef',
            borderRadius: '8px',
            padding: '15px',
            fontSize: '14px',
            color: '#6c757d'
          }}>
            <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>💡 How to Use</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>Your driver's location updates in real-time</li>
              <li>Click "Find Driver" to center the map</li>
              <li>Red marker shows your driver's current position</li>
              <li>Status updates automatically as trip progresses</li>
              {carId && <li>Tracking by Car ID: {carId}</li>}
              {bookingId && <li>Tracking by Booking ID: {bookingId}</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;

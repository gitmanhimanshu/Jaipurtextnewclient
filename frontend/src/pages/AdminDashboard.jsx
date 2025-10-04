import { useState, useEffect } from 'react';
import { Car, Users, Calendar, TrendingUp, CheckCircle, XCircle, Clock, MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import api from '../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [tours, setTours] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddCarModal, setShowAddCarModal] = useState(false);
  const [showAddTourModal, setShowAddTourModal] = useState(false);
  const [showEditCarModal, setShowEditCarModal] = useState(false);
  const [showEditTourModal, setShowEditTourModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [editingTour, setEditingTour] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [carFormData, setCarFormData] = useState({
    name: '',
    type: '',
    description: '',
    pricePerKm: '',
    capacity: '',
    features: '',
    image: '',
    available: true
  });
  const [tourFormData, setTourFormData] = useState({
    name: '',
    description: '',
    from: '',
    to: '',
    distance: '',
    duration: '',
    highlights: '',
    image: '',
    available: true
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, bookingsResponse, usersResponse, toursResponse, carsResponse] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/admin/bookings'),
        api.get('/api/admin/users'),
        api.get('/api/tours'),
        api.get('/api/cars')
      ]);
      
      setStats(statsResponse.data);
      setBookings(bookingsResponse.data);
      setUsers(usersResponse.data);
      setTours(toursResponse.data);
      setCars(carsResponse.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await api.patch(`/api/admin/bookings/${bookingId}/status`, { status });
      fetchDashboardData(); // Refresh data
    } catch (err) {
      console.error('Error updating booking status:', err);
    }
  };

  const handleCarSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const carData = {
        ...carFormData,
        pricePerKm: parseFloat(carFormData.pricePerKm),
        capacity: parseInt(carFormData.capacity),
        features: carFormData.features.split(',').map(f => f.trim()).filter(f => f)
      };

      await api.post('/api/cars', carData);
      setShowAddCarModal(false);
      setCarFormData({
        name: '',
        type: '',
        description: '',
        pricePerKm: '',
        capacity: '',
        features: '',
        image: '',
        available: true
      });
      fetchDashboardData(); // Refresh data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create car');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTourSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const tourData = {
        ...tourFormData,
        distance: parseFloat(tourFormData.distance),
        duration: { hours: parseInt(tourFormData.duration) },
        highlights: tourFormData.highlights.split(',').map(h => h.trim()).filter(h => h)
      };

      await api.post('/api/tours', tourData);
      setShowAddTourModal(false);
      setTourFormData({
        name: '',
        description: '',
        from: '',
        to: '',
        distance: '',
        duration: '',
        highlights: '',
        image: '',
        available: true
      });
      fetchDashboardData(); // Refresh data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create tour');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCar = async (carId) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await api.delete(`/api/cars/${carId}`);
        fetchDashboardData(); // Refresh data
      } catch (err) {
        console.error('Error deleting car:', err);
      }
    }
  };

  const handleDeleteTour = async (tourId) => {
    if (window.confirm('Are you sure you want to delete this tour?')) {
      try {
        await api.delete(`/api/tours/${tourId}`);
        fetchDashboardData(); // Refresh data
      } catch (err) {
        console.error('Error deleting tour:', err);
      }
    }
  };

  const handleEditCar = (car) => {
    setEditingCar(car);
    setCarFormData({
      name: car.name,
      type: car.type,
      description: car.description,
      pricePerKm: car.pricePerKm.toString(),
      capacity: car.capacity.toString(),
      features: car.features.join(', '),
      image: car.image || '',
      available: car.available
    });
    setShowEditCarModal(true);
  };

  const handleEditTour = (tour) => {
    setEditingTour(tour);
    setTourFormData({
      name: tour.name,
      description: tour.description,
      from: tour.from,
      to: tour.to,
      distance: tour.distance.toString(),
      duration: tour.duration.hours.toString(),
      highlights: tour.highlights.join(', '),
      image: tour.image || '',
      available: tour.available
    });
    setShowEditTourModal(true);
  };

  const handleUpdateCar = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const carData = {
        ...carFormData,
        pricePerKm: parseFloat(carFormData.pricePerKm),
        capacity: parseInt(carFormData.capacity),
        features: carFormData.features.split(',').map(f => f.trim()).filter(f => f)
      };

      await api.put(`/api/cars/${editingCar._id}`, carData);
      setShowEditCarModal(false);
      setEditingCar(null);
      fetchDashboardData(); // Refresh data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update car');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTour = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const tourData = {
        ...tourFormData,
        distance: parseFloat(tourFormData.distance),
        duration: { hours: parseInt(tourFormData.duration) },
        highlights: tourFormData.highlights.split(',').map(h => h.trim()).filter(h => h)
      };

      await api.put(`/api/tours/${editingTour._id}`, tourData);
      setShowEditTourModal(false);
      setEditingTour(null);
      fetchDashboardData(); // Refresh data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update tour');
    } finally {
      setSubmitting(false);
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

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        <h1 style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>
        
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #e5e7eb', flexWrap: 'wrap' }}>
          <button
            className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`btn ${activeTab === 'bookings' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('bookings')}
          >
            Bookings
          </button>
          <button
            className={`btn ${activeTab === 'tours' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('tours')}
          >
            Tours
          </button>
          <button
            className={`btn ${activeTab === 'cars' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('cars')}
          >
            Cars
          </button>
          <button
            className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div>
            <h2 style={{ marginBottom: '2rem' }}>Overview</h2>
            <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
              <div className="card" style={{ textAlign: 'center' }}>
                <Users size={32} style={{ color: '#3b82f6', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '2rem', color: '#1f2937' }}>{stats.totalUsers}</h3>
                <p style={{ color: '#6b7280' }}>Total Users</p>
              </div>
              <div className="card" style={{ textAlign: 'center' }}>
                <Calendar size={32} style={{ color: '#10b981', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '2rem', color: '#1f2937' }}>{stats.totalBookings}</h3>
                <p style={{ color: '#6b7280' }}>Total Bookings</p>
              </div>
              <div className="card" style={{ textAlign: 'center' }}>
                <Clock size={32} style={{ color: '#f59e0b', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '2rem', color: '#1f2937' }}>{stats.pendingBookings}</h3>
                <p style={{ color: '#6b7280' }}>Pending Approval</p>
              </div>
              <div className="card" style={{ textAlign: 'center' }}>
                <CheckCircle size={32} style={{ color: '#059669', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '2rem', color: '#1f2937' }}>{stats.approvedBookings}</h3>
                <p style={{ color: '#6b7280' }}>Approved Bookings</p>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            <h2 style={{ marginBottom: '2rem' }}>Bookings Management</h2>
            {bookings.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <Calendar size={64} style={{ color: '#d1d5db', marginBottom: '1rem' }} />
                <h3 style={{ color: '#6b7280' }}>No bookings found</h3>
              </div>
            ) : (
              <div className="grid grid-2">
                {bookings.map((booking) => (
                  <div key={booking._id} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <h3 style={{ marginBottom: '0.5rem' }}>
                          {booking.type === 'car' ? (
                            <>
                              <Car size={20} style={{ marginRight: '0.5rem', color: '#3b82f6' }} />
                              {booking.car?.name}
                            </>
                          ) : (
                            <>
                              <Calendar size={20} style={{ marginRight: '0.5rem', color: '#3b82f6' }} />
                              {booking.tour?.name}
                            </>
                          )}
                        </h3>
                        <p style={{ fontSize: '1.25rem', color: '#10b981', fontWeight: '600' }}>
                          ₹{booking.totalAmount}
                        </p>
                      </div>
                      <span className={`badge badge-${booking.status}`} style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '1rem', 
                        fontSize: '0.8rem', 
                        fontWeight: '500',
                        backgroundColor: booking.status === 'approved' ? '#d1fae5' : 
                                        booking.status === 'rejected' ? '#fee2e2' : '#fef3c7',
                        color: booking.status === 'approved' ? '#065f46' : 
                               booking.status === 'rejected' ? '#991b1b' : '#92400e'
                      }}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{ marginBottom: '0.5rem' }}>
                        <strong>Customer:</strong> {booking.user?.name}
                      </p>
                      <p style={{ marginBottom: '0.5rem' }}>
                        <strong>Contact:</strong> {booking.user?.phone}
                      </p>
                      <p style={{ marginBottom: '0.5rem' }}>
                        <strong>Route:</strong> {booking.pickupLocation} → {booking.dropLocation}
                      </p>
                      <p style={{ marginBottom: '0.5rem' }}>
                        <strong>Date & Time:</strong> {formatDate(booking.pickupDate)} at {formatTime(booking.pickupTime)}
                      </p>
                      <p style={{ marginBottom: '0.5rem' }}>
                        <strong>Distance:</strong> {booking.distance} km
                      </p>
                    </div>

                    {booking.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-success"
                          style={{ flex: 1 }}
                          onClick={() => updateBookingStatus(booking._id, 'approved')}
                        >
                          <CheckCircle size={16} style={{ marginRight: '0.25rem' }} />
                          Approve
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ flex: 1 }}
                          onClick={() => updateBookingStatus(booking._id, 'rejected')}
                        >
                          <XCircle size={16} style={{ marginRight: '0.25rem' }} />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tours Tab */}
        {activeTab === 'tours' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2>Tours Management</h2>
              <button 
                className="btn btn-primary"
                onClick={() => setShowAddTourModal(true)}
              >
                <Plus size={16} style={{ marginRight: '0.5rem' }} />
                Add Tour
              </button>
            </div>
            {tours.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <MapPin size={64} style={{ color: '#d1d5db', marginBottom: '1rem' }} />
                <h3 style={{ color: '#6b7280' }}>No tours found</h3>
                <p style={{ color: '#9ca3af' }}>Add your first tour to get started.</p>
              </div>
            ) : (
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <h3 style={{ marginBottom: '0.5rem' }}>
                          <MapPin size={20} style={{ marginRight: '0.5rem', color: '#3b82f6' }} />
                          {tour.name}
                        </h3>
                        <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                          {tour.from} → {tour.to}
                        </p>
                        <p style={{ color: '#374151' }}>{tour.description}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          className="btn btn-outline" 
                          style={{ padding: '0.5rem' }}
                          onClick={() => handleEditTour(tour)}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="btn btn-danger" 
                          style={{ padding: '0.5rem' }}
                          onClick={() => handleDeleteTour(tour._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{ marginBottom: '0.5rem' }}>
                        <strong>Distance:</strong> {tour.distance} km
                      </p>
                      <p style={{ marginBottom: '0.5rem' }}>
                        <strong>Duration:</strong> {tour.duration.hours} hours
                      </p>
                      {tour.highlights && tour.highlights.length > 0 && (
                        <div>
                          <strong>Highlights:</strong>
                          <ul style={{ marginTop: '0.25rem', paddingLeft: '1rem' }}>
                            {tour.highlights.map((highlight, index) => (
                              <li key={index} style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                                {highlight}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cars Tab */}
        {activeTab === 'cars' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2>Cars Management</h2>
              <button 
                className="btn btn-primary"
                onClick={() => setShowAddCarModal(true)}
              >
                <Plus size={16} style={{ marginRight: '0.5rem' }} />
                Add Car
              </button>
            </div>
            {cars.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <Car size={64} style={{ color: '#d1d5db', marginBottom: '1rem' }} />
                <h3 style={{ color: '#6b7280' }}>No cars found</h3>
                <p style={{ color: '#9ca3af' }}>Add your first car to get started.</p>
              </div>
            ) : (
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <h3 style={{ marginBottom: '0.5rem' }}>
                          <Car size={20} style={{ marginRight: '0.5rem', color: '#3b82f6' }} />
                          {car.name}
                        </h3>
                        <p style={{ fontSize: '1.25rem', color: '#10b981', fontWeight: '600', marginBottom: '0.5rem' }}>
                          ₹{car.pricePerKm} per km
                        </p>
                        <p style={{ color: '#6b7280' }}>{car.description}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          className="btn btn-outline" 
                          style={{ padding: '0.5rem' }}
                          onClick={() => handleEditCar(car)}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="btn btn-danger" 
                          style={{ padding: '0.5rem' }}
                          onClick={() => handleDeleteCar(car._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{ marginBottom: '0.5rem' }}>
                        <strong>Capacity:</strong> {car.capacity} passengers
                      </p>
                      {car.features && car.features.length > 0 && (
                        <div>
                          <strong>Features:</strong>
                          <p style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '0.25rem' }}>
                            {car.features.join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h2 style={{ marginBottom: '2rem' }}>Users Management</h2>
            {users.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <Users size={64} style={{ color: '#d1d5db', marginBottom: '1rem' }} />
                <h3 style={{ color: '#6b7280' }}>No users found</h3>
              </div>
            ) : (
              <div className="card">
                {/* Desktop Table */}
                <div className="desktop-table">
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Phone</th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Registered</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '1rem' }}>{user.name}</td>
                          <td style={{ padding: '1rem' }}>{user.email}</td>
                          <td style={{ padding: '1rem' }}>{user.phone}</td>
                          <td style={{ padding: '1rem', color: '#6b7280' }}>
                            {formatDate(user.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="mobile-cards">
                  {users.map((user) => (
                    <div key={user._id} className="card" style={{ marginBottom: '1rem' }}>
                      <h4 style={{ marginBottom: '0.5rem' }}>{user.name}</h4>
                      <p style={{ color: '#6b7280', marginBottom: '0.25rem' }}>
                        <strong>Email:</strong> {user.email}
                      </p>
                      <p style={{ color: '#6b7280', marginBottom: '0.25rem' }}>
                        <strong>Phone:</strong> {user.phone}
                      </p>
                      <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                        <strong>Registered:</strong> {formatDate(user.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Add Car Modal */}
        {showAddCarModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div className="card" style={{ width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Add New Car</h3>
                <button 
                  className="btn btn-outline" 
                  onClick={() => setShowAddCarModal(false)}
                  style={{ padding: '0.5rem' }}
                >
                  ×
                </button>
              </div>
              
              {error && (
                <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>
              )}

              <form onSubmit={handleCarSubmit}>
                <div className="form-group">
                  <label className="form-label">Car Name</label>
                  <input
                    type="text"
                    className="input"
                    value={carFormData.name}
                    onChange={(e) => setCarFormData({...carFormData, name: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Car Type</label>
                  <select
                    className="input"
                    value={carFormData.type}
                    onChange={(e) => setCarFormData({...carFormData, type: e.target.value})}
                    required
                  >
                    <option value="">Select Car Type</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Ertiga">Ertiga</option>
                    <option value="Innova">Innova</option>
                    <option value="Innova Crysta">Innova Crysta</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="input"
                    value={carFormData.description}
                    onChange={(e) => setCarFormData({...carFormData, description: e.target.value})}
                    rows="3"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Price per KM (₹)</label>
                  <input
                    type="number"
                    className="input"
                    value={carFormData.pricePerKm}
                    onChange={(e) => setCarFormData({...carFormData, pricePerKm: e.target.value})}
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Capacity</label>
                  <input
                    type="number"
                    className="input"
                    value={carFormData.capacity}
                    onChange={(e) => setCarFormData({...carFormData, capacity: e.target.value})}
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Features (comma separated)</label>
                  <input
                    type="text"
                    className="input"
                    value={carFormData.features}
                    onChange={(e) => setCarFormData({...carFormData, features: e.target.value})}
                    placeholder="AC, Music System, GPS"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    type="url"
                    className="input"
                    value={carFormData.image}
                    onChange={(e) => setCarFormData({...carFormData, image: e.target.value})}
                    placeholder="https://example.com/car-image.jpg"
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Adding...' : 'Add Car'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline" 
                    onClick={() => setShowAddCarModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Tour Modal */}
        {showAddTourModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div className="card" style={{ width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Add New Tour</h3>
                <button 
                  className="btn btn-outline" 
                  onClick={() => setShowAddTourModal(false)}
                  style={{ padding: '0.5rem' }}
                >
                  ×
                </button>
              </div>
              
              {error && (
                <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>
              )}

              <form onSubmit={handleTourSubmit}>
                <div className="form-group">
                  <label className="form-label">Tour Name</label>
                  <input
                    type="text"
                    className="input"
                    value={tourFormData.name}
                    onChange={(e) => setTourFormData({...tourFormData, name: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="input"
                    value={tourFormData.description}
                    onChange={(e) => setTourFormData({...tourFormData, description: e.target.value})}
                    rows="3"
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">From</label>
                    <input
                      type="text"
                      className="input"
                      value={tourFormData.from}
                      onChange={(e) => setTourFormData({...tourFormData, from: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">To</label>
                    <input
                      type="text"
                      className="input"
                      value={tourFormData.to}
                      onChange={(e) => setTourFormData({...tourFormData, to: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Distance (km)</label>
                    <input
                      type="number"
                      className="input"
                      value={tourFormData.distance}
                      onChange={(e) => setTourFormData({...tourFormData, distance: e.target.value})}
                      step="0.1"
                      required
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Duration (hours)</label>
                    <input
                      type="number"
                      className="input"
                      value={tourFormData.duration}
                      onChange={(e) => setTourFormData({...tourFormData, duration: e.target.value})}
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Highlights (comma separated)</label>
                  <input
                    type="text"
                    className="input"
                    value={tourFormData.highlights}
                    onChange={(e) => setTourFormData({...tourFormData, highlights: e.target.value})}
                    placeholder="Historical sites, Local cuisine, Photography spots"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    type="url"
                    className="input"
                    value={tourFormData.image}
                    onChange={(e) => setTourFormData({...tourFormData, image: e.target.value})}
                    placeholder="https://example.com/tour-image.jpg"
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Adding...' : 'Add Tour'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline" 
                    onClick={() => setShowAddTourModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Car Modal */}
        {showEditCarModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div className="card" style={{ width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Edit Car</h3>
                <button 
                  className="btn btn-outline" 
                  onClick={() => setShowEditCarModal(false)}
                  style={{ padding: '0.5rem' }}
                >
                  ×
                </button>
              </div>
              
              {error && (
                <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>
              )}

              <form onSubmit={handleUpdateCar}>
                <div className="form-group">
                  <label className="form-label">Car Name</label>
                  <input
                    type="text"
                    className="input"
                    value={carFormData.name}
                    onChange={(e) => setCarFormData({...carFormData, name: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Car Type</label>
                  <select
                    className="input"
                    value={carFormData.type}
                    onChange={(e) => setCarFormData({...carFormData, type: e.target.value})}
                    required
                  >
                    <option value="">Select Car Type</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Ertiga">Ertiga</option>
                    <option value="Innova">Innova</option>
                    <option value="Innova Crysta">Innova Crysta</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="input"
                    value={carFormData.description}
                    onChange={(e) => setCarFormData({...carFormData, description: e.target.value})}
                    rows="3"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Price per KM (₹)</label>
                  <input
                    type="number"
                    className="input"
                    value={carFormData.pricePerKm}
                    onChange={(e) => setCarFormData({...carFormData, pricePerKm: e.target.value})}
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Capacity</label>
                  <input
                    type="number"
                    className="input"
                    value={carFormData.capacity}
                    onChange={(e) => setCarFormData({...carFormData, capacity: e.target.value})}
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Features (comma separated)</label>
                  <input
                    type="text"
                    className="input"
                    value={carFormData.features}
                    onChange={(e) => setCarFormData({...carFormData, features: e.target.value})}
                    placeholder="AC, Music System, GPS"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    type="url"
                    className="input"
                    value={carFormData.image}
                    onChange={(e) => setCarFormData({...carFormData, image: e.target.value})}
                    placeholder="https://example.com/car-image.jpg"
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Updating...' : 'Update Car'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline" 
                    onClick={() => setShowEditCarModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Tour Modal */}
        {showEditTourModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div className="card" style={{ width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Edit Tour</h3>
                <button 
                  className="btn btn-outline" 
                  onClick={() => setShowEditTourModal(false)}
                  style={{ padding: '0.5rem' }}
                >
                  ×
                </button>
              </div>
              
              {error && (
                <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>
              )}

              <form onSubmit={handleUpdateTour}>
                <div className="form-group">
                  <label className="form-label">Tour Name</label>
                  <input
                    type="text"
                    className="input"
                    value={tourFormData.name}
                    onChange={(e) => setTourFormData({...tourFormData, name: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="input"
                    value={tourFormData.description}
                    onChange={(e) => setTourFormData({...tourFormData, description: e.target.value})}
                    rows="3"
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">From</label>
                    <input
                      type="text"
                      className="input"
                      value={tourFormData.from}
                      onChange={(e) => setTourFormData({...tourFormData, from: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">To</label>
                    <input
                      type="text"
                      className="input"
                      value={tourFormData.to}
                      onChange={(e) => setTourFormData({...tourFormData, to: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Distance (km)</label>
                    <input
                      type="number"
                      className="input"
                      value={tourFormData.distance}
                      onChange={(e) => setTourFormData({...tourFormData, distance: e.target.value})}
                      step="0.1"
                      required
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Duration (hours)</label>
                    <input
                      type="number"
                      className="input"
                      value={tourFormData.duration}
                      onChange={(e) => setTourFormData({...tourFormData, duration: e.target.value})}
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Highlights (comma separated)</label>
                  <input
                    type="text"
                    className="input"
                    value={tourFormData.highlights}
                    onChange={(e) => setTourFormData({...tourFormData, highlights: e.target.value})}
                    placeholder="Historical sites, Local cuisine, Photography spots"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    type="url"
                    className="input"
                    value={tourFormData.image}
                    onChange={(e) => setTourFormData({...tourFormData, image: e.target.value})}
                    placeholder="https://example.com/tour-image.jpg"
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Updating...' : 'Update Tour'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline" 
                    onClick={() => setShowEditTourModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

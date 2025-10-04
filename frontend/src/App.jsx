import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import CarLoader from './components/CarLoader';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cars from './pages/Cars';
import Tours from './pages/Tours';
import Booking from './pages/Booking';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import SearchBooking from './pages/SearchBooking';
import DistanceCalculatorDemo from './pages/DistanceCalculatorDemo';
import PlaceBooking from './pages/PlaceBooking';
import CarTracker from './components/CarTracker';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show loader for 2.5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <CarLoader />;
  }

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<SearchBooking />} />
            <Route path="/distance-demo" element={<DistanceCalculatorDemo />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/tours" element={<Tours />} />
            <Route path="/booking/:type/:id" element={<ProtectedRoute><PlaceBooking /></ProtectedRoute>} />
            <Route path="/booking/custom" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
            <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
            <Route path="/track-car" element={<ProtectedRoute><CarTracker /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute admin><AdminDashboard /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

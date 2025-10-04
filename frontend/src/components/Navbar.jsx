import { Link, useNavigate } from 'react-router-dom';
import { Car, Calendar, User, LogOut, Menu, Search, Home } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#3b82f6' }}
                onClick={() => setIsMenuOpen(false)}>
            <Car size={24} />
            <span style={{ marginLeft: '0.5rem', fontSize: '1.25rem', fontWeight: '700' }}>
              Jaipur Taxi
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            style={{ 
              display: 'block', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '0.375rem',
              transition: 'all 0.2s'
            }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '3px',
              width: '20px',
              height: '16px'
            }}>
              <div style={{
                width: '100%',
                height: '2px',
                backgroundColor: '#374151',
                borderRadius: '1px',
                transition: 'all 0.3s',
                transform: isMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
              }}></div>
              <div style={{
                width: '100%',
                height: '2px',
                backgroundColor: '#374151',
                borderRadius: '1px',
                transition: 'all 0.3s',
                opacity: isMenuOpen ? '0' : '1'
              }}></div>
              <div style={{
                width: '100%',
                height: '2px',
                backgroundColor: '#374151',
                borderRadius: '1px',
                transition: 'all 0.3s',
                transform: isMenuOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none'
              }}></div>
            </div>
          </button>

          {/* Desktop Menu */}
          <div className="desktop-menu">
            {isAuthenticated ? (
              <>
                <Link to="/home" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Home size={16} />
                  Home
                </Link>
                <Link to="/search" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Search size={16} />
                  Search & Book
                </Link>
                <Link to="/cars">Cars</Link>
                <Link to="/tours">Tours</Link>
                <Link to="/my-bookings">My Bookings</Link>
                {/* <Link to="/track-car">Track Car</Link> */}
                {user?.role === 'admin' && (
                  <Link to="/admin">Admin</Link>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', background: 'rgba(59, 130, 246, 0.1)' }}>
                  <User size={16} />
                  <span>{user?.name}</span>
                  <button className="btn btn-outline" style={{ padding: '0.5rem', marginLeft: '0.5rem' }} onClick={handleLogout}>
                    <LogOut size={16} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/home" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Home size={16} />
                  Home
                </Link>
                <Link to="/search" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Search size={16} />
                  Search & Book
                </Link>
                <Link to="/cars">Cars</Link>
                <Link to="/tours">Tours</Link>
                <Link to="/login" className="btn btn-outline">Login</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            {isAuthenticated ? (
              <>
                <Link to="/home" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Home size={16} />
                  Home
                </Link>
                <Link to="/search" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Search size={16} />
                  Search & Book
                </Link>
                <Link to="/cars" onClick={() => setIsMenuOpen(false)}>Cars</Link>
                <Link to="/tours" onClick={() => setIsMenuOpen(false)}>Tours</Link>
                <Link to="/my-bookings" onClick={() => setIsMenuOpen(false)}>My Bookings</Link>
                <Link to="/track-car" onClick={() => setIsMenuOpen(false)}>Track Car</Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" onClick={() => setIsMenuOpen(false)}>Admin</Link>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderTop: '1px solid rgba(59, 130, 246, 0.1)', marginTop: '0.5rem' }}>
                  <User size={16} />
                  <span>{user?.name}</span>
                </div>
                <button className="btn btn-outline" style={{ width: '100%' }} onClick={handleLogout}>
                  <LogOut size={16} style={{ marginRight: '0.5rem' }} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/home" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Home size={16} />
                  Home
                </Link>
                <Link to="/search" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Search size={16} />
                  Search & Book
                </Link>
                <Link to="/cars" onClick={() => setIsMenuOpen(false)}>Cars</Link>
                <Link to="/tours" onClick={() => setIsMenuOpen(false)}>Tours</Link>
                <Link to="/login" className="btn btn-outline" style={{ width: '100%' }} onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/register" className="btn btn-primary" style={{ width: '100%' }} onClick={() => setIsMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
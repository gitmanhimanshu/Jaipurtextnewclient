import { Link } from 'react-router-dom';
import { Car, MapPin, Users, Star, Phone, MapPin as LocationIcon, MessageCircle } from 'lucide-react';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '1rem' }}>
            Premium Taxi Service in Jaipur
          </h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: '0.9' }}>
            Reliable, comfortable, and affordable rides for your journey across Rajasthan
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/cars" className="btn" style={{ backgroundColor: 'white', color: '#3b82f6', padding: '1rem 2rem' }}>
              Book a Car
            </Link>
            <Link to="/tours" className="btn" style={{ backgroundColor: 'transparent', color: 'white', border: '1px solid white', padding: '1rem 2rem' }}>
              Explore Tours
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem' }}>
            Why Choose Our Service?
          </h2>
          <div className="grid grid-3">
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <Car size={48} style={{ color: '#3b82f6', marginBottom: '1rem' }} />
              <h3 style={{ marginBottom: '1rem' }}>Premium Vehicles</h3>
              <p style={{ color: '#6b7280' }}>
                Well-maintained vehicles with modern amenities for a comfortable journey
              </p>
            </div>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <Users size={48} style={{ color: '#3b82f6', marginBottom: '1rem' }} />
              <h3 style={{ marginBottom: '1rem' }}>Expert Drivers</h3>
              <p style={{ color: '#6b7280' }}>
                Professional and experienced drivers who know Rajasthan like the back of their hand
              </p>
            </div>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <Star size={48} style={{ color: '#3b82f6', marginBottom: '1rem' }} />
              <h3 style={{ marginBottom: '1rem' }}>24/7 Service</h3>
              <p style={{ color: '#6b7280' }}>
                Available round the clock for all your transportation needs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Types */}
      <section style={{ padding: '4rem 0', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem' }}>
            Our Vehicle Fleet
          </h2>
          <div className="grid grid-3">
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '1rem' }}>
                <img 
                  src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=300&fit=crop" 
                  alt="Sedan Car"
                  style={{ 
                    width: '100%', 
                    height: '200px', 
                    objectFit: 'cover', 
                    borderRadius: '0.5rem' 
                  }}
                />
              </div>
              <h3>Sedan</h3>
              <p style={{ color: '#10b981', fontWeight: '600', fontSize: '1.25rem' }}>₹11 per km</p>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Perfect for city rides and short trips</p>
              <Link to="/cars" className="btn btn-primary">View Details</Link>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '1rem' }}>
                <img 
                  src="https://images.unsplash.com/photo-1563720223185-11003d516935?w=500&h=300&fit=crop" 
                  alt="Ertiga Car"
                  style={{ 
                    width: '100%', 
                    height: '200px', 
                    objectFit: 'cover', 
                    borderRadius: '0.5rem' 
                  }}
                />
              </div>
              <h3>Ertiga</h3>
              <p style={{ color: '#10b981', fontWeight: '600', fontSize: '1.25rem' }}>₹14 per km</p>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>7-seater perfect for family trips</p>
              <Link to="/cars" className="btn btn-primary">View Details</Link>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '1rem' }}>
                <img 
                  src="https://images.unsplash.com/photo-1558618047-7c0b0b0b0b0b?w=500&h=300&fit=crop" 
                  alt="Innova Car"
                  style={{ 
                    width: '100%', 
                    height: '200px', 
                    objectFit: 'cover', 
                    borderRadius: '0.5rem' 
                  }}
                />
              </div>
              <h3>Innova</h3>
              <p style={{ color: '#10b981', fontWeight: '600', fontSize: '1.25rem' }}>₹16 per km</p>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Comfortable SUV for long journeys</p>
              <Link to="/cars" className="btn btn-primary">View Details</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tours */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem' }}>
            Popular Tour Destinations
          </h2>
          <div className="grid grid grid-2">
            <div className="card">
              <div style={{ marginBottom: '1rem' }}>
                <img 
                  src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&h=300&fit=crop" 
                  alt="Sawariya Seth Temple"
                  style={{ 
                    width: '100%', 
                    height: '200px', 
                    objectFit: 'cover', 
                    borderRadius: '0.5rem' 
                  }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <MapPin size={20} style={{ color: '#3b82f6', marginRight: '0.5rem' }} />
                <h3>Jaipur to Sawariya Seth</h3>
              </div>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                Visit the famous temple, a sacred pilgrimage destination known for its spiritual significance.
              </p>
              <Link to="/tours" className="btn btn-outline">Book Tour</Link>
            </div>
            <div className="card">
              <div style={{ marginBottom: '1rem' }}>
                <img 
                  src="https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop" 
                  alt="Udaipur City"
                  style={{ 
                    width: '100%', 
                    height: '200px', 
                    objectFit: 'cover', 
                    borderRadius: '0.5rem' 
                  }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <MapPin size={20} style={{ color: '#3b82f6', marginRight: '0.5rem' }} />
                <h3>Jaipur to Udaipur</h3>
              </div>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                Explore the City of Lakes with its royal heritage and beautiful lakes.
              </p>
              <Link to="/tours" className="btn btn-outline">Book Tour</Link>
            </div>
            <div className="card">
              <div style={{ marginBottom: '1rem' }}>
                <img 
                  src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&h=300&fit=crop" 
                  alt="Khatushyamji Temple"
                  style={{ 
                    width: '100%', 
                    height: '200px', 
                    objectFit: 'cover', 
                    borderRadius: '0.5rem' 
                  }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <MapPin size={20} style={{ color: '#3b82f6', marginRight: '0.5rem' }} />
                <h3>Jaipur to Khatushyamji</h3>
              </div>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                Sacred pilgrimage to Baba Khatushyam temple for spiritual seekers.
              </p>
              <Link to="/tours" className="btn btn-outline">Book Tour</Link>
            </div>
            <div className="card">
              <div style={{ marginBottom: '1rem' }}>
                <img 
                  src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&h=300&fit=crop" 
                  alt="Salasar Balaji Temple"
                  style={{ 
                    width: '100%', 
                    height: '200px', 
                    objectFit: 'cover', 
                    borderRadius: '0.5rem' 
                  }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <MapPin size={20} style={{ color: '#3b82f6', marginRight: '0.5rem' }} />
                <h3>Jaipur to Salasar</h3>
              </div>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                Visit the famous Salasar Balaji temple and experience divine tranquility.
              </p>
              <Link to="/tours" className="btn btn-outline">Book Tour</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section style={{ padding: '4rem 0', backgroundColor: '#1f2937', color: 'white' }}>
        <div className="container">
          <div className="grid grid-3">
            <div style={{ textAlign: 'center' }}>
              <Phone size={32} style={{ color: '#3b82f6', marginBottom: '1rem' }} />
              <h3 style={{ marginBottom: '1rem' }}>Call Us</h3>
              <p style={{ fontSize: '1.25rem', fontWeight: '600' }}>+91 7727984728</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <LocationIcon size={32} style={{ color: '#3b82f6', marginBottom: '1rem' }} />
              <h3 style={{ marginBottom: '1rem' }}>Office Address</h3>
              <p>18A Saraswati Vihar<br />Sitapura, Jaipur<br />Rajasthan 302022</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Star size={32} style={{ color: '#3b82f6', marginBottom: '1rem' }} />
              <h3 style={{ marginBottom: '1rem' }}>Service Hours</h3>
              <p>24/7 Available<br />For all your<br />transportation needs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Action Button for Mobile */}
      <button 
        className="fab"
        onClick={() => window.open('tel:+917727984728', '_self')}
        title="Call Now"
      >
        <Phone size={24} />
      </button>
    </div>
  );
};

export default Home;

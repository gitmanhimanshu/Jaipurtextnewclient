import { Car } from 'lucide-react';

const CarLoader = () => {
  return (
    <div className="car-loader">
      <div className="car-loader-container">
        <div className="car-icon">
          <Car size={48} />
        </div>
        <div className="loading-text">Jaipur Taxi</div>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default CarLoader;










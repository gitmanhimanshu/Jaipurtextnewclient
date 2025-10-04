const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const carRoutes = require('./routes/cars');
const tourRoutes = require('./routes/tours');
const adminRoutes = require('./routes/admin');
const destinationRoutes = require('./routes/destinations');
const placeRoutes = require('./routes/places');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection and server start
const PORT = process.env.PORT || 5000;

const startServer = () => {
  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/cars', carRoutes);
  app.use('/api/tours', tourRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/destinations', destinationRoutes);
  app.use('/api/places', placeRoutes);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('MongoDB Connection Error: MONGODB_URI is not set in environment');
  process.exit(1);
}

mongoose
  .connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 20000,
  })
  .then(() => {
    console.log('MongoDB Connected');
    startServer();
  })
  .catch((err) => {
    console.error('MongoDB Connection Error:', err);
    console.error('Hint: Ensure your IP is whitelisted in Atlas and credentials are correct.');
    process.exit(1);
  });

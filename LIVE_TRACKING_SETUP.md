# 🚗 Live Tracking System Setup Guide

## Quick Start (3 Steps)

### Step 1: Start the Live Tracking Server
```bash
# Open terminal in your project root
cd backend
npm install express socket.io cors
node live-tracking-server.js
```

### Step 2: Start Your Main Application
```bash
# In another terminal
cd backend
node server.js

# In another terminal  
cd frontend
npm run dev
```

### Step 3: Test the System
1. **Open your booking app**: http://localhost:3000
2. **Make a booking** and you'll see "Track Driver" button
3. **Click "Driver GPS"** button to test driver location sharing
4. **Click "Track Driver"** to see live tracking

## 🎯 How It Works

### For Customers:
1. **Book a car/tour** → Get booking ID
2. **Click "Track Driver"** → See live map with driver location
3. **Real-time updates** → Driver location updates automatically

### For Drivers:
1. **Click "Driver GPS"** button
2. **Enter driver details** (ID, Name, Vehicle ID)
3. **Click "Start GPS Tracking"** → Share location in real-time
4. **Location updates** → Automatically sent every second

### For Admins:
1. **Open admin dashboard**: http://localhost:3001/admin
2. **See all drivers** on live map
3. **Monitor bookings** and driver locations

## 📱 Mobile Testing

### Driver GPS (Mobile):
- Open http://localhost:3000 on mobile
- Click "Driver GPS" button
- Allow location access
- See your location on map

### Customer Tracking (Mobile):
- Make a booking
- Click "Track Driver" 
- See driver's live location

## 🔧 Features Added

### In PlaceBooking.jsx:
- ✅ "Track Driver" button (appears after booking)
- ✅ "Driver GPS" button (always visible)
- ✅ Live tracking modal with map
- ✅ Driver panel for GPS sharing

### In MyBookings.jsx:
- ✅ "Track Driver Live" button for approved bookings
- ✅ Live tracking modal integration

### New Components:
- ✅ `LiveTracking.jsx` - Customer tracking interface
- ✅ `DriverPanel.jsx` - Driver GPS sharing interface

## 🗺️ Map Features

- **OpenStreetMap tiles** (free, no API key needed)
- **Real-time markers** for driver locations
- **Live popup updates** with driver info
- **Map controls** (center on Jaipur, find driver)
- **Mobile responsive** design

## 🔌 Technical Details

- **Backend**: Node.js + Socket.IO on port 3001
- **Frontend**: React + Leaflet.js + Socket.IO client
- **Real-time**: WebSocket communication
- **GPS**: HTML5 Geolocation API
- **Maps**: OpenStreetMap (free tiles)

## 🚨 Troubleshooting

### GPS Not Working:
- Ensure HTTPS in production
- Check browser location permissions
- Try on mobile device

### Map Not Loading:
- Check internet connection
- Verify Socket.IO server is running
- Check browser console for errors

### No Live Updates:
- Verify both servers are running
- Check Socket.IO connection status
- Ensure driver is sharing location

## 🌐 Production Deployment

1. **Set environment variables**:
   ```bash
   LIVE_TRACKING_PORT=3001
   ```

2. **Use PM2 for process management**:
   ```bash
   pm2 start live-tracking-server.js --name "live-tracking"
   pm2 start server.js --name "main-app"
   ```

3. **Configure Nginx** for reverse proxy

4. **Enable HTTPS** for GPS functionality

## 📞 Support

- Check browser console for errors
- Verify all servers are running
- Test on mobile device for GPS
- Check network connectivity

---

**Ready to track! 🚗📍**

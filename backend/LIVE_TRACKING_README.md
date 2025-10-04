# 🚗 Live Vehicle Tracking System

A complete real-time vehicle tracking system using **OpenStreetMap + Leaflet.js + Socket.IO** for the Jaipur Taxi application.

## 🌟 Features

- **Real-time GPS tracking** using device geolocation
- **Live map updates** with OpenStreetMap tiles
- **Driver mobile interface** for GPS sharing
- **Admin dashboard** for monitoring all vehicles
- **Customer tracking** for specific bookings
- **100% Free** - No API keys required!

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install express socket.io cors
```

### 2. Start the Live Tracking Server

```bash
node live-tracking-server.js
```

The server will start on `http://localhost:3001`

### 3. Access the Interfaces

- **Admin Dashboard**: http://localhost:3001/admin
- **Driver GPS Sender**: http://localhost:3001/driver
- **Customer Tracking**: http://localhost:3001/tracking

## 📱 How to Use

### For Drivers (Mobile)

1. Open http://localhost:3001/driver on your mobile browser
2. Fill in your Driver ID, Name, and Vehicle ID
3. Optionally enter a Booking ID for specific trip tracking
4. Click "Start GPS Tracking"
5. Allow location access when prompted
6. Your location will be shared in real-time!

### For Admins (Desktop)

1. Open http://localhost:3001/admin on your desktop
2. View all active drivers on the map
3. Click on driver cards to center the map
4. Monitor real-time location updates
5. Track booking statuses and trip progress

### For Customers

1. Open http://localhost:3001/tracking
2. Enter your Booking ID
3. Click "Track Booking"
4. See your driver's real-time location
5. Monitor trip status updates

## 🛠️ Technical Details

### Backend (Node.js + Socket.IO)

- **Port**: 3001 (configurable via `LIVE_TRACKING_PORT` env var)
- **Real-time communication** via WebSockets
- **Driver location broadcasting** to all connected clients
- **Booking status management** with real-time updates

### Frontend (OpenStreetMap + Leaflet)

- **Map tiles**: OpenStreetMap (free)
- **Real-time markers** for driver locations
- **Responsive design** for mobile and desktop
- **Live popup updates** with driver information

### GPS Tracking

- **High accuracy** GPS positioning
- **Automatic updates** every second
- **Background tracking** support
- **Error handling** for location access issues

## 🔧 Configuration

### Environment Variables

```bash
LIVE_TRACKING_PORT=3001  # Port for the tracking server
```

### Customization

- **Map center**: Change coordinates in the HTML files
- **Update frequency**: Modify the `maximumAge` option in geolocation
- **Marker styles**: Customize the Leaflet marker icons
- **UI themes**: Update the CSS styles

## 📊 API Endpoints

### WebSocket Events

**Driver Events:**
- `driver:join` - Driver connects with vehicle info
- `location:update` - Send GPS coordinates
- `booking:accept` - Accept a booking
- `trip:start` - Start a trip
- `trip:complete` - Complete a trip

**Admin Events:**
- `admin:join` - Admin connects to dashboard
- `location:live` - Receive live location updates
- `driver:available` - Driver comes online
- `driver:offline` - Driver goes offline

**Customer Events:**
- `customer:join` - Customer tracks specific booking
- `booking:status` - Receive booking status updates

### REST API

- `GET /api/live-tracking/drivers` - Get all active drivers
- `GET /api/live-tracking/bookings` - Get all active bookings
- `GET /api/live-tracking/booking/:id` - Get specific booking

## 🔒 Security Notes

- **CORS enabled** for all origins (configure for production)
- **No authentication** required (add for production use)
- **Public GPS data** (consider privacy implications)

## 🌐 Production Deployment

### 1. Environment Setup

```bash
# Set production port
export LIVE_TRACKING_PORT=3001

# Start with PM2
pm2 start live-tracking-server.js --name "live-tracking"
```

### 2. Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. SSL/HTTPS

- Use Let's Encrypt for free SSL certificates
- Update WebSocket connections to use `wss://`
- Update GPS requests to use HTTPS (required for geolocation)

## 🐛 Troubleshooting

### Common Issues

1. **GPS not working**: Ensure HTTPS in production
2. **Map not loading**: Check internet connection
3. **Socket connection failed**: Verify server is running
4. **Location permission denied**: Check browser settings

### Debug Mode

Enable console logging in the browser to see:
- Socket connection status
- GPS location updates
- Real-time data flow

## 📱 Mobile Testing

### Android Chrome
- Works perfectly with GPS
- Background tracking supported
- High accuracy positioning

### iOS Safari
- Requires user interaction for GPS
- Background tracking limited
- May need to keep app in foreground

## 🎯 Integration with Main App

This tracking system can be integrated with your main Jaipur Taxi application:

1. **Driver App**: Embed the driver interface
2. **Admin Panel**: Add tracking dashboard
3. **Customer App**: Include booking tracking
4. **API Integration**: Connect with your booking system

## 📄 License

MIT License - Feel free to use and modify!

---

**Happy Tracking! 🚗📍**

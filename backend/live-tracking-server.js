const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");

const app = express();
const server = http.createServer(app);

// Enable CORS for all origins
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"]
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

const io = new Server(server, {
  cors: { 
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store active drivers and their locations
const activeDrivers = new Map();
const activeBookings = new Map();
// Store mapping between car IDs and bookings
const carBookingMap = new Map();

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Driver sends location update
  socket.on("location:update", (data) => {
    console.log("Location update:", data);
    
    const { vehicle_id, lat, lon, ts, driver_id, booking_id } = data;
    
    // Store driver location
    activeDrivers.set(vehicle_id, {
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      ts: ts,
      driver_id: driver_id,
      socket_id: socket.id
    });

    // If this is for a specific booking, store booking location
    if (booking_id) {
      activeBookings.set(booking_id, {
        vehicle_id,
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        ts: ts,
        driver_id: driver_id
      });
      
      // Map car ID to booking ID for easier lookup
      if (vehicle_id) {
        carBookingMap.set(vehicle_id, booking_id);
      }
    }

    // Broadcast to all dashboard clients
    io.emit("location:live", {
      vehicle_id,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      ts: ts,
      driver_id: driver_id,
      booking_id: booking_id
    });
  });

  // Driver joins with vehicle info
  socket.on("driver:join", (data) => {
    const { vehicle_id, driver_id, driver_name } = data;
    console.log(`Driver ${driver_name} (${driver_id}) joined with vehicle ${vehicle_id}`);
    
    socket.vehicle_id = vehicle_id;
    socket.driver_id = driver_id;
    socket.driver_name = driver_name;
    
    // Notify all clients about driver availability
    io.emit("driver:available", {
      vehicle_id,
      driver_id,
      driver_name,
      status: "online"
    });
  });

  // Driver accepts booking
  socket.on("booking:accept", (data) => {
    const { booking_id, vehicle_id, driver_id } = data;
    console.log(`Driver ${driver_id} accepted booking ${booking_id}`);
    
    activeBookings.set(booking_id, {
      vehicle_id,
      driver_id,
      status: "accepted",
      ts: new Date().toISOString()
    });
    
    // Map car ID to booking ID for easier lookup
    if (vehicle_id) {
      carBookingMap.set(vehicle_id, booking_id);
    }
    
    // Notify all clients about booking acceptance
    io.emit("booking:accepted", {
      booking_id,
      vehicle_id,
      driver_id,
      status: "accepted"
    });
  });

  // Driver starts trip
  socket.on("trip:start", (data) => {
    const { booking_id, vehicle_id, driver_id } = data;
    console.log(`Driver ${driver_id} started trip for booking ${booking_id}`);
    
    if (activeBookings.has(booking_id)) {
      activeBookings.get(booking_id).status = "started";
      activeBookings.get(booking_id).start_time = new Date().toISOString();
    }
    
    io.emit("trip:started", {
      booking_id,
      vehicle_id,
      driver_id,
      status: "started"
    });
  });

  // Driver completes trip
  socket.on("trip:complete", (data) => {
    const { booking_id, vehicle_id, driver_id } = data;
    console.log(`Driver ${driver_id} completed trip for booking ${booking_id}`);
    
    if (activeBookings.has(booking_id)) {
      activeBookings.get(booking_id).status = "completed";
      activeBookings.get(booking_id).end_time = new Date().toISOString();
    }
    
    io.emit("trip:completed", {
      booking_id,
      vehicle_id,
      driver_id,
      status: "completed"
    });
  });

  // Customer joins to track their booking by car ID
  socket.on("customer:join:car", (data) => {
    const { car_id, customer_id } = data;
    console.log(`Customer ${customer_id} joined to track car ${car_id}`);
    
    socket.car_id = car_id;
    socket.customer_id = customer_id;
    
    // Find booking ID associated with this car
    const booking_id = carBookingMap.get(car_id);
    
    if (booking_id && activeBookings.has(booking_id)) {
      socket.emit("booking:status", activeBookings.get(booking_id));
    } else {
      socket.emit("booking:notfound", { car_id, message: "No active booking found for this car" });
    }
  });

  // Customer joins to track their booking
  socket.on("customer:join", (data) => {
    const { booking_id, customer_id } = data;
    console.log(`Customer ${customer_id} joined to track booking ${booking_id}`);
    
    socket.booking_id = booking_id;
    socket.customer_id = customer_id;
    
    // Send current booking status if available
    if (activeBookings.has(booking_id)) {
      socket.emit("booking:status", activeBookings.get(booking_id));
    }
  });

  // Admin joins dashboard
  socket.on("admin:join", (data) => {
    console.log("Admin joined dashboard");
    socket.isAdmin = true;
    
    // Send all active drivers and bookings
    socket.emit("dashboard:data", {
      drivers: Array.from(activeDrivers.entries()).map(([id, data]) => ({ vehicle_id: id, ...data })),
      bookings: Array.from(activeBookings.entries()).map(([id, data]) => ({ booking_id: id, ...data }))
    });
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
    
    // Remove driver from active drivers
    if (socket.vehicle_id) {
      activeDrivers.delete(socket.vehicle_id);
      io.emit("driver:offline", {
        vehicle_id: socket.vehicle_id,
        driver_id: socket.driver_id
      });
    }
  });
});

// Serve HTML pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get("/driver", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'driver.html'));
});

app.get("/tracking", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tracking.html'));
});

// API endpoints for getting data
app.get("/api/live-tracking/drivers", (req, res) => {
  const drivers = Array.from(activeDrivers.entries()).map(([id, data]) => ({
    vehicle_id: id,
    ...data
  }));
  res.json(drivers);
});

app.get("/api/live-tracking/bookings", (req, res) => {
  const bookings = Array.from(activeBookings.entries()).map(([id, data]) => ({
    booking_id: id,
    ...data
  }));
  res.json(bookings);
});

app.get("/api/live-tracking/booking/:id", (req, res) => {
  const bookingId = req.params.id;
  const booking = activeBookings.get(bookingId);
  
  if (booking) {
    res.json({ booking_id: bookingId, ...booking });
  } else {
    res.status(404).json({ message: "Booking not found" });
  }
});

// New endpoint to get booking by car ID
app.get("/api/live-tracking/car/:carId", (req, res) => {
  const carId = req.params.carId;
  const bookingId = carBookingMap.get(carId);
  
  if (bookingId) {
    const booking = activeBookings.get(bookingId);
    if (booking) {
      res.json({ booking_id: bookingId, car_id: carId, ...booking });
    } else {
      res.status(404).json({ message: "Booking not found for car", car_id: carId });
    }
  } else {
    res.status(404).json({ message: "No booking found for car", car_id: carId });
  }
});

const PORT = process.env.LIVE_TRACKING_PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Live Tracking Server running on http://localhost:${PORT}`);
  console.log(`📱 Driver GPS Sender: http://localhost:${PORT}/driver`);
  console.log(`🗺️  Admin Dashboard: http://localhost:${PORT}/admin`);
  console.log(`👤 Customer Tracking: http://localhost:${PORT}/tracking`);
});

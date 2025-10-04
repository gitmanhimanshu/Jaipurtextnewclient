# Jaipur Taxi Service - MERN Stack Application

A modern taxi booking service similar to Carzonrent, featuring car rentals and tours in Rajasthan.

## Features

### 🚗 Car Rental Service
- **Sedan (Dzire/Aura)**: ₹11 per/km
- **Ertiga**: ₹14 per/km  
- **Innova**: ₹16 per/km
- **Innova Crysta**: ₹18 per/km

### 🗺️ Tour Services
- Jaipur to Sawariya Seth
- Jaipur to Udaipur
- Jaipur to Khatushyamji
- Jaipur to Salasar

### 👤 User Management
- User registration and authentication
- Admin panel with automatic admin role assignment (via env variables)
- Booking management with approval/rejection system

### 📱 Modern UI
- Responsive design
- Clean, modern interface
- Mobile-friendly

## Tech Stack

**Backend:**
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- bcryptjs for password hashing

**Frontend:**
- React 18
- Vite
- Axios for API calls
- Lucide React for icons
- Modern CSS with responsive design

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB

### 1. Clone the Repository
```bash
git clone <repository-url>
cd clientnew
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Environment Configuration
Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb+srv://himanshuprpwebs_db_user:6CKZ8TPhvI6KEHUu@cluster0.qzfchj2.mongodb.net/
JWT_SECRET=your_jwt_secret_here
ADMIN_EMAIL=admin@jaipurtexi.com
ADMIN_PASSWORD=admin123
PORT=5000
```

### 4. Seed Database (Optional)
```bash
cd backend
npm run seed
```

### 5. Start Backend Server
```bash
cd backend
npm run dev
```

### 6. Frontend Setup (New Terminal)
```bash
cd frontend
npm install
npm run dev
```

## 🌐 Accessing the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📋 Admin Access

The first user to register with the email specified in `ADMIN_EMAIL` environment variable will automatically be assigned admin role.

## 🚀 Key Features Implemented

### User Features:
- Browse available cars and tours
- Create bookings with pickup/drop locations
- View booking history
- Real-time cost calculation

### Admin Features:
- View dashboard with statistics
- Approve/reject bookings
- Manage users list
- Monitor all booking activities

## 📞 Contact Information

**Office Address:**
18A Saraswati Vihar  
Sitapura, Jaipur  
Rajasthan 302022  

**Phone:** +91 7727984728

## 🛠️ Development

### Backend API Endpoints:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/cars` - Get all cars
- `GET /api/tours` - Get all tours
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `GET /api/admin/bookings` - Get all bookings (admin)
- `PATCH /api/admin/bookings/:id/status` - Update booking status (admin)

### Project Structure:
```
clientnew/
├── backend/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   └── styles/      # CSS styles
│   └── package.json
└── README.md
```

## 🔧 Environment Variables

Make sure to set up the following environment variables in your `.env` file:

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `ADMIN_EMAIL`: Email address for admin role assignment
- `ADMIN_PASSWORD`: Password for admin user
- `PORT`: Server port (default: 5000)

## 📝 License

This project is licensed under the ISC License.










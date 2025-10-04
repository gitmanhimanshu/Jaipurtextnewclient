#!/bin/bash

echo "========================================"
echo "   Jaipur Taxi Live Tracking System"
echo "========================================"
echo

echo "Installing dependencies..."
cd backend
npm install express socket.io cors

echo
echo "Starting Live Tracking Server..."
echo
echo "📱 Driver GPS Sender: http://localhost:3001/driver"
echo "🗺️  Admin Dashboard: http://localhost:3001/admin"
echo "👤 Customer Tracking: http://localhost:3001/tracking"
echo

node live-tracking-server.js

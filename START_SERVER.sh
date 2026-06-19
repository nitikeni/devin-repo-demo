#!/bin/bash

# Student Attendance Webapp - Server Startup Script

echo "========================================"
echo "Student Attendance Webapp"
echo "========================================"
echo ""
echo "Starting server..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo ""
fi

# Start the server
echo "Starting Express server..."
echo ""
npm start

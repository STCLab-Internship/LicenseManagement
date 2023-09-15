#!/bin/bash

# Check if ports 8005 and 8006 are open and kill the processes if they are
if lsof -Pi :8005 -sTCP:LISTEN -t >/dev/null; then
    echo "Killing process on port 8005"
    kill -9 $(lsof -Pi :8005 -sTCP:LISTEN -t)
fi

if lsof -Pi :8006 -sTCP:LISTEN -t >/dev/null; then
    echo "Killing process on port 8006"
    kill -9 $(lsof -Pi :8006 -sTCP:LISTEN -t)
fi

# Change directory to the backend
cd backend

# Start the backend server
echo "Starting backend server..."
node index.js

# Change directory to the client
cd ../client

# Build the client application
echo "Building client application..."
npm run build

# Serve the built client application on port 8006
echo "Serving client application on port 8006..."
serve -s build -l 8006

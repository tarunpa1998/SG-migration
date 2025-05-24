#!/bin/bash

# Handle errors
set -e

# Set environment variables
export NODE_ENV=production

# Echo commands being executed
set -x

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Build Next.js for production
echo "Building Next.js app..."
npx next build

# Build Express server with TypeScript
echo "Building Express server..."
npx tsc --project tsconfig.json

# Start the server
echo "Starting the server..."
node dist/server/index.js
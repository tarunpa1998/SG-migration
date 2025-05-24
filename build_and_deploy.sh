#!/bin/bash

# Exit on error
set -e

echo "===== Building Next.js + Express Application ====="

# Set environment variables
export NODE_ENV=production
export PORT=5000

# Create output directory
mkdir -p dist

# Step 1: Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Step 2: Build Next.js for production
echo "Building Next.js app..."
npx next build

# Step 3: Building TypeScript files
echo "Transpiling TypeScript files..."
npx tsc --project tsconfig.json

# Step 4: Prepare distribution package
echo "Preparing deployment package..."

# Copy Next.js build artifacts
cp -r .next dist/
cp -r public dist/

# Copy necessary files for Next.js
cp next.config.js dist/
cp package.json dist/

# Create a start script for the deployed application
cat > dist/start.js << 'EOL'
// Production server script
const express = require('express');
const next = require('next');
const path = require('path');
const { parse } = require('url');

const dev = process.env.NODE_ENV !== 'production';
const app = express();
const nextApp = next({ dev, dir: path.resolve(__dirname) });
const handle = nextApp.getRequestHandler();

// Port should always be 5000 on Replit
const PORT = process.env.PORT || 5000;

// Import Express API routes
const apiRoutes = require('./server/index.js');

nextApp.prepare().then(() => {
  console.log('Next.js app prepared');
  
  // API routes are handled by Express
  app.use('/api', apiRoutes);
  
  // Handle all other routes with Next.js
  app.all('*', (req, res) => {
    const parsedUrl = parse(req.url, true);
    return handle(req, res, parsedUrl);
  });
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}).catch(err => {
  console.error('Error starting server:', err);
  process.exit(1);
});
EOL

echo "===== Build Complete ====="
echo "Deployment package available in ./dist directory"
echo "To start the application in production mode, run: node dist/start.js"
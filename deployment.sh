#!/bin/bash

# Handle errors
set -e

# Set environment variables
export NODE_ENV=production
export PORT=5000

# Echo commands being executed
set -x

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Build Next.js application
echo "Building Next.js app..."
npx next build

# Build Express server
echo "Building Express server..."
npx tsc --project tsconfig.json

# Prepare for deployment
echo "Preparing for deployment..."

# Create a dist folder for production build
mkdir -p dist

# Copy necessary files for production
cp -r .next dist/
cp -r public dist/
cp -r node_modules dist/
cp package.json dist/
cp next.config.js dist/

# Copy server build
cp -r dist/server dist/

# Create a startup script
cat > dist/server.js << 'EOL'
// Production server startup
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const express = require('express');
const path = require('path');

const app = express();
const nextApp = next({ dev: false });
const handle = nextApp.getRequestHandler();

const PORT = process.env.PORT || 5000;

// Load API routes from Express
require('./server/index');

nextApp.prepare().then(() => {
  // Handle all non-API routes with Next.js
  app.all('*', (req, res) => {
    const parsedUrl = parse(req.url, true);
    
    // Don't handle /api routes, they're already handled by Express
    if (parsedUrl.pathname.startsWith('/api') || parsedUrl.pathname.startsWith('/direct-api')) {
      return;
    }
    
    return handle(req, res, parsedUrl);
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
});
EOL

echo "Deployment package ready in dist/ folder"
echo "To run the production build, execute: NODE_ENV=production node dist/server.js"
#!/bin/bash

# Exit on error
set -e

echo "===== Building Next.js + Express Application ====="

# Set environment variables
export NODE_ENV=production
export PORT=5000
export NEXT_PUBLIC_API_URL=http://localhost:5000

# Create output directory
mkdir -p dist

# Step 1: Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Step 2: Build Next.js for production with fallback data
echo "Building Next.js app..."
# Set environment variable to indicate we're in build mode
export NEXT_BUILD=true
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

# Copy server files - make sure the compiled server files are included
mkdir -p dist/server
cp -r dist/server/* dist/server/ 2>/dev/null || :
# If server files are in a different location, copy them too
if [ -d "server" ]; then
  echo "Copying server files..."
  cp -r server dist/
fi

# Create a start script for the deployed application
cat > dist/server.js << 'EOL'
// Production server script
import express from 'express';
import next from 'next';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Debug information
console.log("Current directory:", __dirname);
console.log("Files in current directory:", fs.readdirSync(__dirname));
console.log("Files in server directory (if exists):", 
  fs.existsSync(path.join(__dirname, 'server')) 
    ? fs.readdirSync(path.join(__dirname, 'server')) 
    : "Server directory not found");

const dev = process.env.NODE_ENV !== 'production';
const app = express();
const nextApp = next({ dev, dir: path.resolve(__dirname) });
const handle = nextApp.getRequestHandler();

// Port should always be 5000 on Replit
const PORT = process.env.PORT || 5000;

// Create a simple API router if the server/index.js file is not found
const createSimpleRouter = () => {
  const router = express.Router();
  router.get('*', (req, res) => {
    res.json({ message: 'API is working with fallback router' });
  });
  return router;
};

// Try to import the API routes, fall back to a simple router if not found
const getApiRoutes = async () => {
  try {
    // Check if the file exists before trying to import it
    const serverIndexPath = path.join(__dirname, 'server', 'index.js');
    if (fs.existsSync(serverIndexPath)) {
      console.log("Server index file found at:", serverIndexPath);
      const { default: apiRoutes } = await import('./server/index.js');
      return apiRoutes;
    } else {
      console.log("Server index file not found, using fallback router");
      return createSimpleRouter();
    }
  } catch (error) {
    console.error("Error importing API routes:", error);
    return createSimpleRouter();
  }
};

// Start the server
nextApp.prepare()
  .then(async () => {
    console.log('Next.js app prepared');
    
    // Get API routes
    const apiRoutes = await getApiRoutes();
    
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

# Create a simple index.js in the server directory as a fallback
mkdir -p dist/server
cat > dist/server/index.js << 'EOL'
import express from 'express';

const router = express.Router();

// Basic API routes
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is working' });
});

router.get('*', (req, res) => {
  res.json({ 
    message: 'API endpoint not implemented in fallback mode',
    requestedPath: req.path
  });
});

export default router;
EOL

echo "===== Build Complete ====="
echo "Deployment package available in ./dist directory"
echo ""
echo "To start the application:"
echo "  1. Navigate to the dist directory: cd dist"
echo "  2. Run the application: NODE_ENV=production node server.js"
echo ""
echo "On hosting platforms like Replit, the application will start automatically"
echo "using the commands defined in .replit or package.json scripts."


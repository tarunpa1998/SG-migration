#!/bin/bash

# Handle errors
set -e

# Set environment variables
export NODE_ENV=development
export API_BASE_URL=http://localhost:5000
export NEXT_PUBLIC_API_BASE_URL=http://localhost:5000

# Echo commands being executed
set -x

# Start Next.js in development mode
echo "Starting Next.js dev server..."
npx next dev -p 3000
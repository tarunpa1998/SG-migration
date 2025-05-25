#!/bin/bash

echo "🏗️  Building Next.js application for production..."

# Build Next.js app
echo "Building Next.js frontend..."
npx next build

# Build backend server
echo "Building Express server..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "✅ Production build completed!"
echo "🚀 To start production server, run: npm start"
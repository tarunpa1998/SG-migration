import express, { type Express } from "express";
import { createServer as createHttpServer } from "http";
import { parse } from "url";
import next from "next";
import path from "path";
import fs from "fs";
import { log } from "./vite"; // Reusing the log function from vite.ts

// Function to setup Next.js in development mode
export async function setupNext(app: Express, server: ReturnType<typeof createHttpServer>) {
  // Create a Next.js instance
  const dev = process.env.NODE_ENV !== "production";
  const nextApp = next({ dev, dir: path.resolve(process.cwd()) });
  const handle = nextApp.getRequestHandler();
  
  // Prepare Next.js
  await nextApp.prepare();
  
  log("Next.js app prepared", "next");
  
  // Handle all other routes with Next.js
  app.all("*", (req, res) => {
    const parsedUrl = parse(req.url!, true);
    
    // Don't handle /api routes, they're already handled by Express
    if (parsedUrl.pathname?.startsWith("/api") || parsedUrl.pathname?.startsWith("/direct-api")) {
      return;
    }

    // Let Next.js handle the request
    return handle(req, res, parsedUrl);
  });
  
  return { nextApp, handle };
}

// Function to serve Next.js in production mode
export function serveNextStatic(app: Express) {
  const distPath = path.resolve(process.cwd(), ".next/server/pages");
  
  // Verify the build directory exists
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the Next.js build directory: ${distPath}. Make sure to build Next.js first with 'next build'.`
    );
  }
  
  log("Serving Next.js production build", "next");
  
  // Serve static files from Next.js build
  app.use("/_next", express.static(path.join(process.cwd(), ".next")));
  app.use("/static", express.static(path.join(process.cwd(), "public")));
  
  // Setup a custom server for Next.js in production
  const nextApp = next({ dev: false, dir: process.cwd() });
  const handle = nextApp.getRequestHandler();
  
  // Prepare Next.js in production mode
  nextApp.prepare().then(() => {
    // Handle all non-API routes with Next.js
    app.all("*", (req, res) => {
      const parsedUrl = parse(req.url!, true);
      
      // Don't handle /api routes
      if (parsedUrl.pathname?.startsWith("/api") || parsedUrl.pathname?.startsWith("/direct-api")) {
        return;
      }
      
      return handle(req, res, parsedUrl);
    });
  });
}
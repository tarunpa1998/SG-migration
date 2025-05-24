import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Global typing for the cached connection
declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection | null> | null;
  };
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB database
 * Returns a mongoose connection object or null if connection fails
 */
export async function connectToDatabase() {
  try {
    if (cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30
      };

      cached.promise = mongoose.connect(MONGODB_URI, opts)
        .then((mongoose) => {
          console.log('Connected to MongoDB');
          return mongoose.connection;
        })
        .catch((error) => {
          console.error('Error connecting to MongoDB:', error.message);
          // Clear the promise to allow retry later
          cached.promise = null;
          throw error; // Re-throw to be caught by the outer catch
        });
    }

    try {
      cached.conn = await cached.promise;
    } catch (error) {
      console.error('Error retrieving MongoDB connection:', error);
      cached.promise = null;
      return null;
    }
    return cached.conn;
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}

export default connectToDatabase;
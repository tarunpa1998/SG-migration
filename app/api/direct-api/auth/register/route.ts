import { NextRequest, NextResponse } from 'next/server';

// Define the Express backend URL
const EXPRESS_URL = process.env.API_BASE_URL || 'http://localhost:5000';

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();
    
    // Forward the request to the Express backend
    const response = await fetch(`${EXPRESS_URL}/direct-api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });
    
    // Get the response data
    const data = await response.json();
    
    // Return the response with appropriate status
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error forwarding register request:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';

// Define the Express backend URL
const EXPRESS_URL = process.env.API_BASE_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    
    // Forward the request to the Express backend
    const response = await fetch(`${EXPRESS_URL}/direct-api/auth/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { 'Authorization': authHeader } : {})
      },
      credentials: 'include',
      // Don't cache this response
      cache: 'no-store',
    });
    
    // Get the response data
    const data = await response.json();
    
    // Return the response with appropriate status
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error forwarding user info request:', error);
    return NextResponse.json(
      { error: 'Failed to get user information' },
      { status: 500 }
    );
  }
}
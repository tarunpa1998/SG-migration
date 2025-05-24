import { NextRequest, NextResponse } from 'next/server';

// Define the Express backend URL
const EXPRESS_URL = process.env.API_BASE_URL || 'http://localhost:5000';

export async function PUT(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();
    
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    
    // Forward the request to the Express backend
    const response = await fetch(`${EXPRESS_URL}/direct-api/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { 'Authorization': authHeader } : {})
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });
    
    // Get the response data
    const data = await response.json();
    
    // Return the response with appropriate status
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
}
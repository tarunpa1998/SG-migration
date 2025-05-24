import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the auth token from the request
    const authHeader = request.headers.get('Authorization') || '';

    // Forward the request to the Express backend
    const res = await fetch('/direct-api/auth/user', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    // Get the response data
    const data = await res.json();

    // Return the response with appropriate status
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}
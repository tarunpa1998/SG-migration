import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get login credentials from the request
    const body = await request.json();

    // Forward the request to the Express backend
    const res = await fetch('/direct-api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Get the response data
    const data = await res.json();

    // Return the response with appropriate status
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
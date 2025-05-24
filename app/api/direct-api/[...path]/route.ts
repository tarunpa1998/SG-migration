import { NextRequest, NextResponse } from 'next/server';

const EXPRESS_URL = 'http://localhost:5000'; // URL of your Express backend

// Handle GET requests to /direct-api/*
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  
  // Get search params
  const searchParams = request.nextUrl.searchParams;
  const queryString = searchParams.toString();
  const url = `${EXPRESS_URL}/direct-api/${path}${queryString ? `?${queryString}` : ''}`;
  
  try {
    // Forward the request to the Express backend
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        // Forward authorization header if present
        ...(request.headers.get('authorization') 
          ? { 'Authorization': request.headers.get('authorization')! } 
          : {})
      },
      // Include cookies in the request
      credentials: 'include',
      cache: 'no-store', // Don't cache API responses by default
    });
    
    // Get the response data
    const data = await response.json();
    
    // Return the response with appropriate status
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(`Error forwarding GET request to ${url}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch data from backend' },
      { status: 500 }
    );
  }
}

// Handle POST requests to /direct-api/*
export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  
  try {
    // Get the request body
    const body = await request.json();
    
    // Forward the request to the Express backend
    const response = await fetch(`${EXPRESS_URL}/direct-api/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward authorization header if present
        ...(request.headers.get('authorization') 
          ? { 'Authorization': request.headers.get('authorization')! } 
          : {})
      },
      body: JSON.stringify(body),
      // Include cookies in the request
      credentials: 'include',
    });
    
    // Get the response data
    const data = await response.json();
    
    // Return the response with appropriate status
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(`Error forwarding POST request to /direct-api/${path}:`, error);
    return NextResponse.json(
      { error: 'Failed to send data to backend' },
      { status: 500 }
    );
  }
}

// Handle PUT requests to /direct-api/*
export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  
  try {
    // Get the request body
    const body = await request.json();
    
    // Forward the request to the Express backend
    const response = await fetch(`${EXPRESS_URL}/direct-api/${path}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Forward authorization header if present
        ...(request.headers.get('authorization') 
          ? { 'Authorization': request.headers.get('authorization')! } 
          : {})
      },
      body: JSON.stringify(body),
      // Include cookies in the request
      credentials: 'include',
    });
    
    // Get the response data
    const data = await response.json();
    
    // Return the response with appropriate status
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(`Error forwarding PUT request to /direct-api/${path}:`, error);
    return NextResponse.json(
      { error: 'Failed to update data on backend' },
      { status: 500 }
    );
  }
}

// Handle DELETE requests to /direct-api/*
export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  
  try {
    // Forward the request to the Express backend
    const response = await fetch(`${EXPRESS_URL}/direct-api/${path}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // Forward authorization header if present
        ...(request.headers.get('authorization') 
          ? { 'Authorization': request.headers.get('authorization')! } 
          : {})
      },
      // Include cookies in the request
      credentials: 'include',
    });
    
    // Get the response data
    const data = await response.json();
    
    // Return the response with appropriate status
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(`Error forwarding DELETE request to /direct-api/${path}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete data on backend' },
      { status: 500 }
    );
  }
}
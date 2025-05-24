import { NextRequest, NextResponse } from 'next/server';

// This acts as a catch-all proxy to the Express backend
export async function GET(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const apiPath = pathname.replace(/^\/api/, '');
  
  try {
    // Forward the request to our Express backend
    const apiUrl = `http://localhost:5000/api${apiPath}${search}`;
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from API' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const apiPath = pathname.replace(/^\/api/, '');
  
  try {
    const body = await request.json();
    
    // Forward the request to our Express backend
    const apiUrl = `http://localhost:5000/api${apiPath}${search}`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to process API request' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';

// This is a catch-all API route that proxies requests to the Express backend
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  try {
    // Forward the request to the Express backend
    const url = `/direct-api/${path}${request.nextUrl.search}`;
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(request.headers.has('Authorization') && 
           { 'Authorization': request.headers.get('Authorization') as string }),
      },
    });

    // Get the response data
    const data = await res.json();

    // Return the response
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error proxying GET request to /api/${path}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch data from the server' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  try {
    // Get the request body
    const body = await request.json();

    // Forward the request to the Express backend
    const url = `/direct-api/${path}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(request.headers.has('Authorization') && 
           { 'Authorization': request.headers.get('Authorization') as string }),
      },
      body: JSON.stringify(body),
    });

    // Get the response data
    const data = await res.json();

    // Return the response
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error proxying POST request to /api/${path}:`, error);
    return NextResponse.json(
      { error: 'Failed to submit data to the server' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  try {
    // Get the request body
    const body = await request.json();

    // Forward the request to the Express backend
    const url = `/direct-api/${path}`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(request.headers.has('Authorization') && 
           { 'Authorization': request.headers.get('Authorization') as string }),
      },
      body: JSON.stringify(body),
    });

    // Get the response data
    const data = await res.json();

    // Return the response
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error proxying PUT request to /api/${path}:`, error);
    return NextResponse.json(
      { error: 'Failed to update data on the server' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  try {
    // Forward the request to the Express backend
    const url = `/direct-api/${path}${request.nextUrl.search}`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(request.headers.has('Authorization') && 
           { 'Authorization': request.headers.get('Authorization') as string }),
      },
    });

    // Get the response data
    const data = await res.json();

    // Return the response
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error proxying DELETE request to /api/${path}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete data on the server' },
      { status: 500 }
    );
  }
}
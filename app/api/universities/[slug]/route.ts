import { NextRequest, NextResponse } from 'next/server';

// This route handles fetching a single university by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  try {
    // Forward the request to our Express backend
    const response = await fetch(`http://localhost:5000/api/universities/${slug}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Handle 404 case
    if (response.status === 404) {
      return NextResponse.json(
        { error: 'University not found' },
        { status: 404 }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`University API error for slug ${slug}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch university' },
      { status: 500 }
    );
  }
}

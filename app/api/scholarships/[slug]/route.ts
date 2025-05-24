import { NextRequest, NextResponse } from 'next/server';

// This route handles fetching a single scholarship by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  
  try {
    // Forward the request to our Express backend
    const response = await fetch(`http://localhost:5000/api/scholarships/${slug}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Handle 404 case
    if (response.status === 404) {
      return NextResponse.json(
        { error: 'Scholarship not found' },
        { status: 404 }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Scholarship API error for slug ${slug}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch scholarship' },
      { status: 500 }
    );
  }
}
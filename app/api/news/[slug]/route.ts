import { NextRequest } from 'next/server';
import { handleApiError, successResponse } from '@/lib/api-utils';
import connectToDatabase from '@/lib/mongodb';
import { News } from '@/models';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Get slug from URL
    const { slug } = params;
    
    // Find news item by slug
    const newsItem = await News.findOne({ slug });
    
    // Return 404 if not found
    if (!newsItem) {
      return successResponse({ error: 'News item not found' }, 404);
    }
    
    // Increment view count
    newsItem.views = (newsItem.views || 0) + 1;
    await newsItem.save();
    
    return successResponse(newsItem);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Get slug from URL
    const { slug } = params;
    
    // Parse request body
    const data = await request.json();
    
    // Find and update news item
    const newsItem = await News.findOneAndUpdate(
      { slug },
      { $set: data },
      { new: true, runValidators: true }
    );
    
    // Return 404 if not found
    if (!newsItem) {
      return successResponse({ error: 'News item not found' }, 404);
    }
    
    return successResponse(newsItem);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Get slug from URL
    const { slug } = params;
    
    // Find and delete news item
    const result = await News.findOneAndDelete({ slug });
    
    // Return 404 if not found
    if (!result) {
      return successResponse({ error: 'News item not found' }, 404);
    }
    
    return successResponse({ message: 'News item deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
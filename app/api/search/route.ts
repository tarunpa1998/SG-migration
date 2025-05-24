import { NextRequest } from 'next/server';
import { handleApiError, successResponse, getSearchParams } from '@/lib/api-utils';
import connectToDatabase from '@/lib/mongodb';
import { Article, Scholarship, Country, University, News } from '@/models';

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Get query parameter
    const params = getSearchParams(request);
    const query = params.query;
    
    // Validate query parameter
    if (!query || query.trim() === '') {
      return successResponse({ error: 'Search query is required' }, 400);
    }
    
    // Create regex pattern for search (case insensitive)
    const regex = new RegExp(escapeRegex(query), 'i');
    
    // Search in all collections in parallel
    const [articles, scholarships, universities, countries, newsItems] = await Promise.all([
      // Search in Articles
      Article.find({
        $or: [
          { title: regex },
          { content: regex },
          { summary: regex },
          { category: regex }
        ]
      }).limit(10),
      
      // Search in Scholarships
      Scholarship.find({
        $or: [
          { title: regex },
          { description: regex },
          { country: regex },
          { tags: regex }
        ]
      }).limit(10),
      
      // Search in Universities
      University.find({
        $or: [
          { name: regex },
          { description: regex },
          { country: regex },
          { programsOffered: regex }
        ]
      }).limit(10),
      
      // Search in Countries
      Country.find({
        $or: [
          { name: regex },
          { description: regex },
          { overview: regex }
        ]
      }).limit(10),
      
      // Search in News
      News.find({
        $or: [
          { title: regex },
          { content: regex },
          { summary: regex },
          { category: regex }
        ]
      }).limit(10)
    ]);
    
    // Prepare response with search results
    const response = {
      articles,
      scholarships,
      universities,
      countries,
      news: newsItems,
      query
    };
    
    return successResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
}

// Helper function to escape regex special characters
function escapeRegex(text: string) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
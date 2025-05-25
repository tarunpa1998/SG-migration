/**
 * Utility functions for API fetching with Next.js SSR/ISR capabilities
 */

export async function fetchAPI(endpoint: string, options?: RequestInit) {
  try {
    // Determine the base URL based on environment
    const baseUrl = typeof window === 'undefined' 
      ? (process.env.NEXT_PUBLIC_API_URL || process.env.API_BASE_URL || 'http://localhost:5000')
      : '';
    
    // Use absolute URL for server-side requests, relative URL for client-side
    const url = typeof window === 'undefined'
      ? `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
      : (endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`);
    
    const fetchOptions: any = {
      ...options,
      // Add Next.js cache config (for ISR) when running on server
      next: { revalidate: 60 } // 60 seconds
    };
    
    // During build, return empty data instead of failing
    if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
      try {
        const response = await fetch(url, fetchOptions);
        if (!response.ok) {
          console.warn(`API request failed during build: ${url}`);
          return [];
        }
        return await response.json();
      } catch (error) {
        console.warn(`API request failed during build: ${url}`, error);
        return [];
      }
    }
    
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];  // Return empty array as default to prevent undefined errors
  }
}

// Helper functions for specific data types
export async function fetchCountries() {
  return fetchAPI('/api/countries');
}

export async function fetchArticles() {
  return fetchAPI('/api/articles');
}

export async function fetchNews() {
  return fetchAPI('/api/news');
}

export async function fetchScholarships() {
  return fetchAPI('/api/scholarships');
}

export async function fetchUniversities() {
  return fetchAPI('/api/universities');
}



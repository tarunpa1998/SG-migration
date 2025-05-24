/**
 * Utility functions for API fetching with Next.js SSR/ISR capabilities
 */

export async function fetchAPI(endpoint: string, options?: RequestInit) {
  const baseUrl = process.env.API_BASE_URL || 'http://localhost:5000';
  const url = `${baseUrl}${endpoint}`;
  
  try {
    // For server-side requests with Next.js, we need to use the cache options
    // The TS types don't match the actual API, so we use any to avoid issues
    const fetchOptions: any = {
      ...options
    };
    
    // Add Next.js cache config (for ISR) when running on server
    if (typeof window === 'undefined') {
      fetchOptions.next = { revalidate: 60 }; // 60 seconds
    }
    
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
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
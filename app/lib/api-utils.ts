import { NextRequest, NextResponse } from 'next/server';

/**
 * Handles errors in API routes
 * @param error Error object
 * @param status HTTP status code
 * @returns NextResponse with error details
 */
export function handleApiError(error: any, status = 500) {
  console.error('API Error:', error);
  
  return NextResponse.json(
    {
      error: "An error occurred",
      message: error instanceof Error ? error.message : "Unknown error",
    },
    { status }
  );
}

/**
 * Creates a successful response
 * @param data Response data
 * @param status HTTP status code
 * @returns NextResponse with data
 */
export function successResponse(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

/**
 * Extracts search params from URL
 * @param request NextRequest
 * @returns Record of search params
 */
export function getSearchParams(request: NextRequest): Record<string, string> {
  const url = new URL(request.url);
  const params: Record<string, string> = {};
  
  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
}

/**
 * Extracts path parameter from a URL
 * @param request NextRequest
 * @param param Parameter name
 * @returns Parameter value
 */
export function getPathParam(request: NextRequest, param: string): string | null {
  const url = new URL(request.url);
  const path = url.pathname;
  const parts = path.split('/');
  const paramIndex = parts.indexOf(param);
  
  if (paramIndex !== -1 && paramIndex < parts.length - 1) {
    return parts[paramIndex + 1];
  }
  
  return null;
}
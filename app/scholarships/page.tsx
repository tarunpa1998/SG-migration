import React from 'react';
import { Metadata } from 'next';
import ScholarshipsClient from './scholarships-client';

// Export metadata for SEO
export const metadata: Metadata = {
  title: 'Scholarships | Study Guru',
  description: 'Browse and find scholarships for international students. Filter by country, scholarship type, and more.',
};

// Server component
export default function ScholarshipsPage() {
  return <ScholarshipsClient />;
}
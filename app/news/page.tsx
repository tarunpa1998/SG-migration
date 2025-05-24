import React from 'react';
import { Metadata } from 'next';
import NewsList from './news-list';

export const metadata: Metadata = {
  title: 'News | Study Guru',
  description: 'Stay updated with the latest education news, scholarship announcements, and updates for international students.',
};

export default async function NewsPage() {
  // Fetch news data
  const newsResponse = await fetch(`${process.env.API_BASE_URL || 'http://localhost:5000'}/api/news`, {
    cache: 'no-store'
  });
  const newsItems = await newsResponse.json();

  return <NewsList initialNewsItems={newsItems} />;
}
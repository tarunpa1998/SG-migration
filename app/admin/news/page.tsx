'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import NewsAdmin from '@/components/admin/NewsAdmin';

export default function AdminNewsPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-10">
      <NewsAdmin />
    </div>
  );
}
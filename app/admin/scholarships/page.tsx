'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import ScholarshipsAdmin from '@/components/admin/ScholarshipsAdmin';

export default function AdminScholarshipsPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-10">
      <ScholarshipsAdmin />
    </div>
  );
}
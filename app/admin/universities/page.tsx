'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import UniversitiesAdmin from '@/components/admin/UniversitiesAdmin';

export default function AdminUniversitiesPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-10">
      <UniversitiesAdmin />
    </div>
  );
}
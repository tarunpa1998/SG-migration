'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import CountriesAdmin from '@/components/admin/CountriesAdmin';

export default function AdminCountriesPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-10">
      <CountriesAdmin />
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import ArticlesAdmin from '@/components/admin/ArticlesAdmin';

export default function AdminArticlesPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-10">
      <ArticlesAdmin />
    </div>
  );
}
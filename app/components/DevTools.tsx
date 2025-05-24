'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { toast } from '../hooks/use-toast';

export const DevTools = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePopulateData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/dev/seed');
      const data = await response.json();
      
      if (data.message) {
        toast({
          title: 'Success',
          description: data.message,
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to populate data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-slate-100 rounded-lg mt-4">
      <h3 className="text-lg font-medium mb-2">Development Tools</h3>
      <div className="flex space-x-2">
        <Button 
          variant="default" 
          onClick={handlePopulateData} 
          disabled={isLoading}
        >
          {isLoading ? 'Populating...' : 'Populate Database'}
        </Button>
      </div>
    </div>
  );
};

export default DevTools;
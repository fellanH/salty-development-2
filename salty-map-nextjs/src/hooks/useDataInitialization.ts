'use client';

import { useEffect, useState } from 'react';
import { useAppContext } from '@/lib/context/AppContext';
import { dataService } from '@/lib/services/dataService';

export function useDataInitialization() {
  const { bulkCacheBeaches, bulkCachePOIs, setLoading } = useAppContext();
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initializeData = async () => {
      if (isInitialized) return;

      try {
        setLoading(true);
        setError(null);

        console.log('🗺️ Salty Map Application Loading...');
        console.log('🚀 Initializing data...');

        const { beaches, pois } = await dataService.initializeData();

        if (!isMounted) return;

        // Cache the data in the app context
        bulkCacheBeaches(beaches);
        bulkCachePOIs(pois);

        setIsInitialized(true);
        console.log('✅ Application data initialized successfully!');
      } catch (error) {
        console.error('❌ Failed to initialize application data:', error);
        if (isMounted) {
          setError(error instanceof Error ? error.message : 'Failed to load application data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeData();

    return () => {
      isMounted = false;
    };
  }, [isInitialized, bulkCacheBeaches, bulkCachePOIs, setLoading]);

  return { isInitialized, error };
}
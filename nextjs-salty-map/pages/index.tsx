// =============================================================================
// HOME PAGE
// =============================================================================

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout/Layout';
import Sidebar from '@/components/UI/Sidebar';
import { useApp } from '@/contexts/AppContext';
import { useBeaches } from '@/hooks/useBeaches';
import { usePOIs } from '@/hooks/usePOIs';
import styles from '@/styles/Home.module.css';

// Dynamically import Map component to avoid SSR issues with Mapbox
const MapContainer = dynamic(() => import('@/components/Map/MapContainer'), {
  ssr: false,
  loading: () => <div className="loading">Loading map...</div>,
});

export default function Home() {
  const { dispatch } = useApp();
  const { beaches, isLoading: beachesLoading, isError: beachesError } = useBeaches();
  const { pois, isLoading: poisLoading, isError: poisError } = usePOIs();

  // Update state with fetched data
  useEffect(() => {
    if (beaches.length > 0) {
      dispatch({ type: 'SET_BEACHES', payload: beaches });
    }
  }, [beaches, dispatch]);

  useEffect(() => {
    if (pois.length > 0) {
      dispatch({ type: 'SET_POIS', payload: pois });
    }
  }, [pois, dispatch]);

  // Handle loading states
  if (beachesLoading || poisLoading) {
    return (
      <Layout>
        <div className="loading">Loading application data...</div>
      </Layout>
    );
  }

  // Handle error states
  if (beachesError || poisError) {
    return (
      <Layout>
        <div className="error">
          <div>
            <h2>Error loading data</h2>
            <p>Please check your connection and refresh the page.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.container}>
        <Sidebar />
        <MapContainer />
      </div>
    </Layout>
  );
}